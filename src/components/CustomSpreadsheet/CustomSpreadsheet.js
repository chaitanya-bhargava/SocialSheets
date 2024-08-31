import React, { useState, useEffect } from 'react';
import Spreadsheet from 'react-spreadsheet';
import supabase from '../../supabase';
import { useParams } from 'react-router-dom';
import './CustomSpreadsheet.css';

const CustomSpreadsheet = () => {
  const { id } = useParams();
  const [cells, setCells] = useState([]);
  const [activeCell, setActiveCell] = useState({ value: "" });
  const [activeCellCoords, setActiveCellCoords] = useState({
    row: 0,
    column: 0,
  });

  const handleInsert = (payload) => {
    console.log('Insert received!', payload);
  };

  const handleUpdate = (payload) => {
    console.log('Update received!', payload);
    debugger
    if(payload.new.id===id) setCells(payload.new.cells.cells);
  };

  const handleDelete = (payload) => {
    console.log('Delete received!', payload);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('spreadsheets')
        .select('cells')
        .eq('id', id);
      setActiveCell(data[0].cells.cells[0][0]);
      setCells(data[0].cells.cells);
    };

    fetchData();

    const subscribeToCellChanges = () => {
      const channel = supabase.channel('cells_channel');

      channel.on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'spreadsheets' },
        handleInsert
      );

      channel.on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'spreadsheets' },
        handleUpdate
      );

      channel.on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'spreadsheets' },
        handleDelete
      );

      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to cell changes!');
        } else {
          console.log('Failed to subscribe:', status);
        }
      });
    };

    subscribeToCellChanges();
  }, [id]);

  const handleChanges = async ({ row, column }) => {
    if (activeCell.value !== "") {
      setCells((prevCells) => {
        const updatedCells = [...prevCells];
        updatedCells[activeCellCoords.row][activeCellCoords.column] = activeCell;
        return updatedCells;
      });
    }
    setActiveCell({ value: "" });
    setActiveCellCoords({ row, column });
  };

  useEffect(() => {
    const updateSupaBase = async () => {
      if (cells.length > 0) {
        await supabase
          .from('spreadsheets')
          .update({ cells: { cells: cells } })
          .eq('id', id)
          .select();
      }
    };
    updateSupaBase();
  }, [activeCellCoords]);

  const handleKeyChanges = (event) => {
    if (event.keyCode >= 48 && event.keyCode <= 57) {
      setActiveCell({ value: event.target.value });
    } else if (event.keyCode >= 65 && event.keyCode <= 90) {
      setActiveCell({ value: event.target.value });
    } else if (event.keyCode >= 97 && event.keyCode <= 122) {
      setActiveCell({ value: event.target.value });
    } else if (event.key === "Enter") {
      setActiveCell({ value: event.target.value });
    }
  };

  return (
    <div>
      <div className="spreadsheet-info">
        <div>Spreadsheet ID: {id}</div>
        <div>Share this with other users who want to join this spreadsheet!</div>
      </div>
        <Spreadsheet data={cells} onActivate={handleChanges} onKeyDown={handleKeyChanges} />
    </div>
  );
};

export default CustomSpreadsheet;
