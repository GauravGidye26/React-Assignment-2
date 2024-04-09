import React, { useState, useEffect } from 'react';
import { Table, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Pagination from './PaginationComponent';

function ListTable() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [newTitle, setnewTitle] = useState('');
  const [updateItem, setUpdateItem] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/albums');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const addItem = () => {
    if (newTitle.trim() === '') {
      setError('Item cannot be blank');
      return;
    }
    setData([...data, { id: data.length + 1, title: newTitle }]);
    setnewTitle('');
    setError('');
  };

  const deleteItem = (id) => {
    setData(data.filter(item => item.id !== id));
  };
  
  const updateSelectedItem = () => {
    if (!selectedItem || updateItem.trim() === '') {
      setError('Please select an item and enter a new value');
      return;
    }
    setData(data.map(item => item.id === selectedItem.id ? { ...item, title: updateItem } : item));
    setUpdateItem('');
    setSelectedItem(null);
    setError('');
  };

  const manageSelectedItem = (item) => {
    setSelectedItem(item);
    setUpdateItem(item.title);
    setError('');
  };

  const clearError = () => {
    setError('');
  };

  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="container">
      <h1>List Table</h1>
      <Form.Group controlId="newItem">
        <Form.Label>Add New Title:</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter new title here..."
          value={newTitle}
          onChange={(e) => { setnewTitle(e.target.value); clearError(); }}
        />
        
      </Form.Group><br/>
	  <div className="d-grid gap-2">
      <Button variant="dark" size="lg" onClick={addItem}>Add Title</Button>
	  </div>
	  <br/>
	  {selectedItem && (
        <>
          <Form.Group controlId="updateItem">
            <Form.Label>Update Title:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter updated title here..."
              value={updateItem}
              onChange={(e) => { setUpdateItem(e.target.value); clearError(); }}
            />
          </Form.Group>
		  <br/>
		  <div className="d-grid gap-2">
          <Button variant="dark" size="lg" onClick={updateSelectedItem}>Update Title</Button>
		  </div>
        </>
      )}
	  {error && <Form.Text className="text-danger">{error}</Form.Text>}
	  <br/>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Title</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index} >
              <td>{indexOfFirstItem + index + 1}</td>
              <td onClick={() => manageSelectedItem(item)}>{item.title}</td>
              <td>
                <Button variant="danger" onClick={() => deleteItem(item.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
	  
	  <br/>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(data.length / rowsPerPage)}
        paginate={paginate}
      />
    </div>
  );
}

export default ListTable;
