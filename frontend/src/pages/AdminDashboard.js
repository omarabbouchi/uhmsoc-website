import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [players, setPlayers] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        number: '',
        position: '',
        year: '',
        hometown: '',
        photo: null
    });
    const [admins, setAdmins] = useState([]);
    const [adminFormData, setAdminFormData] = useState({
        username: '',
        password: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                console.log('Token:', token); // Debug log
                
                if (!token) {
                    navigate('/admin/login');
                    return;
                }

                const response = await fetch('/api/players', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                console.log('Response status:', response.status); // Debug log
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('Players data:', data); // Debug log
                    setPlayers(data);
                } else {
                    const errorData = await response.json();
                    console.error('Server error:', errorData); // Debug log
                    throw new Error(errorData.error || 'Failed to fetch players');
                }
            } catch (error) {
                console.error('Detailed error:', error); // Debug log
                alert('Error loading players: ' + error.message);
            }
        };

        fetchPlayers();
    }, [navigate]);

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const response = await fetch('/api/admin/all', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setAdmins(data);
                }
            } catch (error) {
                console.error('Error fetching admins:', error);
            }
        };

        fetchAdmins();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'photo') {
            console.log('File selected:', files[0]?.name, 'Type:', files[0]?.type);
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleAddPlayer = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            const form = new FormData();
            
            // Log what we're sending
            console.log('Sending data:', {
                name: formData.name,
                number: formData.number,
                position: formData.position,
                year: formData.year,
                hometown: formData.hometown,
                hasPhoto: !!formData.photo
            });

            // Append all form data
            Object.keys(formData).forEach(key => {
                if (key === 'photo' && formData[key]) {
                    form.append('photo', formData[key]);
                } else if (formData[key]) {
                    form.append(key, formData[key]);
                }
            });

            const response = await fetch('/api/players', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: form
            });

            if (!response.ok) {
                const text = await response.text();
                console.error('Server response:', text);
                throw new Error(text || 'Failed to add player');
            }

            const data = await response.json();
            setPlayers([...players, data]);
            setFormData({
                name: '',
                number: '',
                position: '',
                year: '',
                hometown: '',
                photo: null
            });
            
            // Reset file input
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) fileInput.value = '';

        } catch (error) {
            console.error('Detailed error:', error);
            alert('Error adding player: ' + error.message);
        }
    };

    const handleDeletePlayer = async (number) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`/api/players/${number}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                // Remove player from state
                setPlayers(players.filter(player => player.number !== number));
                alert('Player deleted successfully');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete player');
            }
        } catch (error) {
            console.error('Error deleting player:', error);
            alert('Error deleting player: ' + error.message);
        }
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('/api/admin/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(adminFormData)
            });

            if (response.ok) {
                const newAdmin = await response.json();
                setAdmins([newAdmin, ...admins]);
                setAdminFormData({ username: '', password: '' });
                alert('Admin created successfully');
            } else {
                const error = await response.json();
                throw new Error(error.error);
            }
        } catch (error) {
            alert('Error creating admin: ' + error.message);
        }
    };

    const handleDeleteAdmin = async (id) => {
        if (!window.confirm('Are you sure you want to delete this admin?')) {
            return;
        }
        
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`/api/admin/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setAdmins(admins.filter(admin => admin.id !== id));
                alert('Admin deleted successfully');
            } else {
                const error = await response.json();
                throw new Error(error.error);
            }
        } catch (error) {
            alert('Error deleting admin: ' + error.message);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Admin Dashboard</h2>
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Photo</th>
                            <th>Number</th>
                            <th>Name</th>
                            <th>Position</th>
                            <th>Year</th>
                            <th>Hometown</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(players) && players.map(player => (
                            <tr key={player.number}>
                                <td>
                                    {player.photo_url ? (
                                        <img 
                                            src={player.photo_url} 
                                            alt={player.name}
                                            style={{ 
                                                width: '50px', 
                                                height: '50px', 
                                                objectFit: 'cover',
                                                borderRadius: '4px'
                                            }}
                                        />
                                    ) : (
                                        <div 
                                            style={{ 
                                                width: '50px', 
                                                height: '50px', 
                                                backgroundColor: '#eee',
                                                borderRadius: '4px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            No Photo
                                        </div>
                                    )}
                                </td>
                                <td>{player.number}</td>
                                <td>{player.name}</td>
                                <td>{player.position}</td>
                                <td>{player.year}</td>
                                <td>{player.hometown}</td>
                                <td>
                                    <button className="btn btn-sm btn-warning me-2">Edit</button>
                                    <button 
                                        className="btn btn-sm btn-danger" 
                                        onClick={() => handleDeletePlayer(player.number)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4">
                <h3>Add Player</h3>
                <form className="row g-3" onSubmit={handleAddPlayer}>
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-md-2">
                        <input
                            type="number"
                            className="form-control"
                            name="number"
                            placeholder="Number"
                            value={formData.number}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            name="position"
                            placeholder="Position"
                            value={formData.position}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            name="year"
                            placeholder="Year"
                            value={formData.year}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            name="hometown"
                            placeholder="Hometown"
                            value={formData.hometown}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-12 mb-3">
                        <label className="form-label">Player Photo</label>
                        <input
                            type="file"
                            className="form-control"
                            name="photo"
                            accept="image/*"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-12">
                        <button type="submit" className="btn btn-primary">
                            Add Player
                        </button>
                    </div>
                </form>
            </div>
            <div className="mt-5">
                <h3>Admin Management</h3>
                <div className="row">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h4>Create New Admin</h4>
                                <form onSubmit={handleCreateAdmin}>
                                    <div className="mb-3">
                                        <label className="form-label">Username</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={adminFormData.username}
                                            onChange={(e) => setAdminFormData({
                                                ...adminFormData,
                                                username: e.target.value
                                            })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={adminFormData.password}
                                            onChange={(e) => setAdminFormData({
                                                ...adminFormData,
                                                password: e.target.value
                                            })}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">
                                        Create Admin
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h4>Existing Admins</h4>
                                <div className="list-group">
                                    {admins.map(admin => (
                                        <div key={admin.id} className="list-group-item d-flex justify-content-between align-items-center">
                                            {admin.username}
                                            <button 
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDeleteAdmin(admin.id)}
                                                disabled={admins.length <= 1}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
