import React, { useState, useEffect } from "react";
import { ReactGrid } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
import { createClient } from "@supabase/supabase-js";

// Supabase setup
const supabaseUrl = 'https://zwbriswstaddmusjunqb.supabase.co/';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3YnJpc3dzdGFkZG11c2p1bnFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNDc3ODM4NiwiZXhwIjoyMDQwMzU0Mzg2fQ.U3dICm3TzHqfntG47o8P9G-w7lcLI8MX3vTKm78vIng';
const supabase = createClient(supabaseUrl, supabaseKey);

// // Function to get columns
const getColumns = () => [
  { columnId: "name", width: 150 },
  { columnId: "surname", width: 150 }
];

// Header row for the grid
const headerRow = {
  rowId: "header",
  cells: [
    { type: "header", text: "Name" },
    { type: "header", text: "Surname" }
  ]
};

// Function to generate rows based on people data
const getRows = (people) => [
  headerRow,
  ...people.map((person, idx) => ({
    rowId: idx,
    cells: [
      { type: "text", text: person.name },
      { type: "text", text: person.surname }
    ]
  }))
];

const applyChangesToPeople = (changes, prevPeople) => {
  const updatedPeople = [...prevPeople];
  changes.forEach((change) => {
    const personIndex = updatedPeople.findIndex(person => person.id === change.rowId);
    if (personIndex >= 0) {
      const fieldName = change.columnId;
      updatedPeople[personIndex] = {
        ...updatedPeople[personIndex],
        [fieldName]: change.newCell.text
      };
    }
  });
  return updatedPeople;
};

function App() {
  const [people, setPeople] = useState([]);

  // Fetch initial data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('people').select('*');
      debugger
      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setPeople(data || []);
      }
    };

    fetchData();

    // Real-time subscription to changes in the "people" table
    const subscription = supabase
      .channel('people')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'people' }, payload => {
        console.log("Change received:", payload);

        if (payload.eventType === 'INSERT') {
          setPeople(prevPeople => [...prevPeople, payload.new]);
        } else if (payload.eventType === 'UPDATE') {
          setPeople(prevPeople =>
            prevPeople.map(person =>
              person.id === payload.new.id ? payload.new : person
            )
          );
        } else if (payload.eventType === 'DELETE') {
          setPeople(prevPeople =>
            prevPeople.filter(person => person.id !== payload.old.id)
          );
        }
      })
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeSubscription(subscription);
    };
  }, []);

  const handleChanges = async (changes) => {
    const updatedPeople = applyChangesToPeople(changes, people);

    // Update Supabase
    const updatePromises = changes.map(change => {
      const { columnId, newCell, rowId } = change;
      return supabase
        .from('people')
        .update({ [columnId]: newCell.text })
        .eq('id', rowId);
    });

    const results = await Promise.all(updatePromises);
    const error = results.find(result => result.error);

    if (error) {
      console.error("Error updating Supabase:", error);
    } else {
      setPeople(updatedPeople);
    }
  };


  const rows = getRows(people);
  const columns = getColumns();

  return <ReactGrid rows={rows} columns={columns} onCellsChanged={handleChanges}/>;
}

export default App;
