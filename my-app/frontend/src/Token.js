import axios from 'axios';

export async function token() {
    const token = localStorage.getItem('token');
    const response = await axios.post('http://localhost:5000/ReadToken', {
        token: token
    });
    
    return response;
}
