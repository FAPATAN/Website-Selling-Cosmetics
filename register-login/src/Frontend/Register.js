import React, { useState } from 'react';
import './Register.css';

const Register = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirm: ''
  });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    }
    // TODO: ส่งข้อมูลไป backend
    setError('');
    alert('สมัครสมาชิกสำเร็จ!');
  };

  return (
    <div className="register-container">
      <h2>สมัครสมาชิก</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <input type="password" name="confirm" placeholder="Confirm Password" value={form.confirm} onChange={handleChange} required />
        {error && <div className="error">{error}</div>}
        <button type="submit">สมัครสมาชิก</button>
      </form>
    </div>
  );
};

export default Register;
