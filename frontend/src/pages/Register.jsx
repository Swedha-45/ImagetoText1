import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Form from '../components/Form';

function Register() {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("access")) {
            navigate("/home", { replace: true });
        }
    }, []);

    return (
        <>
            <Form route="/api/user/register/" method="register" />
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <Link to="/login">Already have an account? Login here</Link>
            </div>
        </>
    );
}

export default Register;