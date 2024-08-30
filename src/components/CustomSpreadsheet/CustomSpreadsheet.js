import Spreadsheet from 'react-spreadsheet';
import { useState, useEffect } from 'react';
import supabase from '../../supabase';

const CustomSpreadsheet = () => {
  const [cells, setCells] = useState([]);

  const handleInsert = (payload) => {
    console.log('Insert received!', payload);
  };
  
  // Function to handle updates
  const handleUpdate = (payload) => {
    console.log('Update received!', payload);

    setCells(payload.new.cells.cells)
  };
  
  // Function to handle deletes
  const handleDelete = (payload) => {
    console.log('Delete received!', payload);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('spreadsheets').select('cells').eq('id',1);

      setCells(data[0].cells.cells);
    };

    fetchData();

    const subscribeToCellChanges = () => {
      // Create a new channel
      const channel = supabase.channel('cells_channel');
      
      // Listen to INSERT events
      channel.on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'spreadsheets' }, 
        handleInsert
      );
    
      // Listen to UPDATE events
      channel.on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'spreadsheets' }, 
        handleUpdate
      );
    
      // Listen to DELETE events
      channel.on('postgres_changes', 
        { event: 'DELETE', schema: 'public', table: 'spreadsheets' }, 
        handleDelete
      );
    
      // Subscribe to the channel
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to cell changes!');
        } else {
          console.log('Failed to subscribe:', status);
        }
      });
    };

    subscribeToCellChanges();
  }, []);  
  
  const handleChanges = async (newCells) => {
    await supabase.from('spreadsheets').update({cells:{
      cells:newCells
    }}).eq('id',1).select();
    debugger
  }

  return <Spreadsheet data={cells} onChange={handleChanges}/>;
}

export default CustomSpreadsheet;
