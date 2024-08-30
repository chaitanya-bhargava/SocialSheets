import Spreadsheet from 'react-spreadsheet';
import { useState, useEffect} from 'react';
import supabase from '../../supabase';

const CustomSpreadsheet = ({spreadsheet_id}) => {
  const [cells, setCells] = useState([]);
  const [activeCell,setActiveCell] = useState({value:""});
  const [activeCellCoords,setActiveCellCoords] = useState({
    row:0,
    column:0
  })

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
      const { data } = await supabase.from('spreadsheets').select('cells').eq('id',spreadsheet_id);
      debugger
      setActiveCell(data[0].cells.cells[0][0]);
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
  }, [spreadsheet_id]);  
  
  

  const handleChanges = async ({row,column}) => {
    if(activeCell.value!==""){
      setCells(prevCells => {
        const updatedCells = [...prevCells];
        updatedCells[activeCellCoords.row][activeCellCoords.column] = activeCell;
        return updatedCells;
      });
    }
    setActiveCell({value:""});
    setActiveCellCoords({row,column});
  }

  useEffect(()=>{
    const updateSupaBase = async () => {
      if(cells.length>0){
        await supabase.from('spreadsheets').update({cells:{
          cells:cells
        }}).eq('id',spreadsheet_id).select();
      }
    }
    updateSupaBase();
  },[activeCellCoords])

  const handleKeyChanges = (event) =>{
    if (event.keyCode >= 48 && event.keyCode <= 57) {
        setActiveCell({value:event.target.value})
    } else if (event.keyCode >= 65 && event.keyCode <= 90) {
        setActiveCell({value:event.target.value})
    } else if (event.keyCode >= 97 && event.keyCode <= 122) {
        setActiveCell({value:event.target.value})
    } else if (event.key==="Enter"){
        setActiveCell({value:event.target.value})
    }
  }

  return <Spreadsheet data={cells} onActivate={handleChanges} onKeyDown={handleKeyChanges}/>;
}

export default CustomSpreadsheet;
