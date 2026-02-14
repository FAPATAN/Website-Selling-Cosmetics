import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Bestsellerform1 from './Bestsellerform1';
import { Mail, Lock, User, Phone, MapPin, Loader2, LogIn, UserPlus } from 'lucide-react';
import './App.css';
import ForgotPasswordSystem from './forgot';

const MessageBox = ({ title, body, isError, onClose }) => {
    if (!body) return null;

    return (
        <div className="message-box-overlay">
            <div className="message-box">
                <h3 className={`message-box-title ${isError ? 'error' : 'success'}`}>
                    {title}
                </h3>
                <p className="message-box-body">{body}</p>
                <button 
                    onClick={onClose}
                    className={`message-box-button ${isError ? 'error' : 'success'}`}
                >
                    ตกลง
                </button>
            </div>
        </div>
    );
};

const InputField = ({ label, id, type = 'text', value, onChange, required = false, icon: Icon, placeholder = '' }) => (
    <div className="input-wrapper">
        <div className="input-container">
            {Icon && <Icon className="input-icon" />}
            <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder || label}
                className="input-field"
            />
        </div>
    </div>
);

const RegisterForm = ({ onRegisterSuccess, showMessage }) => {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');

        // Validate required fields
        if (!name || !surname || !email || !phone || !username || !password || !confirmPassword) {
            setMessage('❌ กรุณากรอกข้อมูลให้ครบทุกช่อง');
            showMessage('ข้อมูลไม่ครบ', 'กรุณากรอกข้อมูลให้ครบทุกช่องที่จำเป็น', true);
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage('❌ รูปแบบอีเมลไม่ถูกต้อง');
            showMessage('อีเมลไม่ถูกต้อง', 'กรุณากรอกอีเมลในรูปแบบที่ถูกต้อง', true);
            return;
        }

        // Validate password match
        if (password !== confirmPassword) {
            setMessage('❌ รหัสผ่านในช่อง Password และ Confirm Password ไม่ตรงกัน');
            showMessage('รหัสผ่านไม่ตรงกัน', 'กรุณาตรวจสอบรหัสผ่านให้ตรงกันทั้งสองช่อง', true);
            return;
        }

        // Validate password length
        if (password.length < 6) {
            setMessage('❌ รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
            showMessage('รหัสผ่านสั้นเกินไป', 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร', true);
            return;
        }

        setIsLoading(true);

        const registrationData = {
            Username: username,
            Password: password,
            Name: name,
            Surname: surname,
            Email: email,
            Phone: phone,
            Address: address,
            Member_role: 'M',
            Status: 'Y',
        };

        try {
            const response = await fetch('http://localhost:5000/api/insert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registrationData),
            });

            const data = await response.json();

            if (response.ok) {
                showMessage('ลงทะเบียนสำเร็จ!', 'คุณลงทะเบียนสำเร็จแล้ว! ระบบจะนำไปหน้าเข้าสู่ระบบทันที', false);
                setUsername(''); setEmail(''); setPassword(''); setConfirmPassword('');
                setName(''); setSurname(''); setPhone(''); setAddress('');
                setTimeout(onRegisterSuccess, 1000);
            } else {
                const errorMsg = data.error || data.msg || 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์';
                setMessage(`❌ ลงทะเบียนไม่สำเร็จ: ${errorMsg}`);
                showMessage('ลงทะเบียนไม่สำเร็จ', errorMsg, true);
            }
        } catch (error) {
            console.error('Registration failed:', error);
            setMessage('❌ ข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
            showMessage('ข้อผิดพลาด', 'ข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์ กรุณาตรวจสอบว่า Backend ทำงานอยู่', true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="form-container" onSubmit={handleRegister}>
            <h2 className="form-title">Sign Up Here</h2>
            
            {message && (
                <p className={`alert-message ${message.startsWith('❌') ? 'error' : 'success'}`}>
                    {message}
                </p>
            )}

            <div className="grid-2-cols">
                <InputField label="ชื่อ" id="name" value={name} onChange={(e) => setName(e.target.value)} required icon={User} />
                <InputField label="นามสกุล" id="surname" value={surname} onChange={(e) => setSurname(e.target.value)} required icon={User} />
            </div>
            
            <div className="grid-2-cols">
                <InputField label="อีเมล" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required icon={Mail} />
                <InputField label="เบอร์โทรศัพท์" id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required icon={Phone} />
            </div>

            <div className="textarea-wrapper">
                <MapPin className="textarea-icon" />
                <textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows="2"
                    placeholder="ที่อยู่"
                    className="textarea-field"
                />
            </div>

            <div className="grid-2-cols">
                <InputField label="ชื่อผู้ใช้งาน" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required icon={User} />
                <InputField label="รหัสผ่านอย่างน้อย6ตัว" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required icon={Lock} />
            </div>

            <InputField label="ยืนยันรหัสผ่าน" id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required icon={Lock} />

            <button
                type="submit"
                className="btn-primary"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="btn-icon spinning" /> 
                        Registering...
                    </>
                ) : (
                    'Register'
                )}
            </button>

            <div className="divider-text">
                or use your account
            </div>
            
            <div className="social-buttons">
                {['F', 'G', 'T'].map((letter, i) => (
                    <button key={i} type="button" className="social-btn">
                        {letter}
                    </button>
                ))}
            </div>
        </form>
    );
};

const LoginForm = ({ onLoginSuccess, showMessage }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        // Validate required fields
        if (!email || !password) {
            const errorMessage = 'กรุณากรอกอีเมลและรหัสผ่าน';
            setError(`❌ ${errorMessage}`);
            showMessage('ข้อมูลไม่ครบ', errorMessage, true);
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            const errorMessage = 'รูปแบบอีเมลไม่ถูกต้อง';
            setError(`❌ ${errorMessage}`);
            showMessage('อีเมลไม่ถูกต้อง', 'กรุณากรอกอีเมลในรูปแบบที่ถูกต้อง', true);
            return;
        }

        setIsLoading(true);

        const loginData = { Email: email, Password: password };

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();

            if (response.ok) {
                showMessage('สำเร็จ', `เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับ ${data.username || data.userRole || email}`, false);
                if (onLoginSuccess) {
                    onLoginSuccess({ email, role: data.userRole });
                }
                setTimeout(() => {
                    window.location.href = '/Home/home.html';
                }, 1000);
            } else {
                const errorMessage = data.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
                setError(`❌ ${errorMessage}`);
                showMessage('เข้าสู่ระบบไม่สำเร็จ', errorMessage, true);
            }
        } catch (error) {
            console.error('Login failed:', error);
            const connectionError = 'ข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์';
            setError(`❌ ${connectionError}`);
            showMessage('ข้อผิดพลาด', connectionError, true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="login-form-container" onSubmit={handleLogin}>
            <h2 className="form-title login-form-title">Log In Here</h2>
            
            {error && (
                <p className="alert-message error login-alert">
                    {error}
                </p>
            )}
            
            <InputField 
                label="อีเมล" 
                id="login-email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                icon={Mail} 
                placeholder="your.email@example.com" 
            />

            <div style={{ marginBottom: '20px' }}>
                <InputField 
                    label="รหัสผ่าน" 
                    id="login-password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    icon={Lock} 
                    placeholder="รหัสผ่าน" 
                />
                <div className="login-options">
                    <label className="remember-me">
                        <input type="checkbox" />
                        <span>Remember Me</span>
                    </label>
                    <a href="/forgot" className="forgot-password">
                        Forgot your password?
                    </a>
                </div>
            </div>

            <button
                type="submit"
                className="btn-primary login"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="btn-icon login spinning" /> 
                        Logging In...
                    </>
                ) : (
                    'Log In'
                )}
            </button>

            <div className="divider-text login">
                or use your account
            </div>
            
            <div className="social-buttons login">
                {['F', 'G', 'T'].map((letter, i) => (
                    <button key={i} type="button" className="social-btn login">
                        {letter}
                    </button>
                ))}
            </div>
        </form>
    );
};

export default function App() {
    const [isRegisterView, setIsRegisterView] = useState(true);
    const [currentPage, setCurrentPage] = useState('auth'); // 'auth' or 'forgot'
    const [messageBox, setMessageBox] = useState({ visible: false, title: '', body: '', isError: false });

    const showMessage = (title, body, isError = false) => {
        setMessageBox({ visible: true, title, body, isError });
    };

    const handleRegisterSuccess = () => {
        setIsRegisterView(false);
    };

    const handleLoginSuccess = (userData) => {
        console.log('Login successful for user:', userData.email);
    };

    return (
        <Routes>
            <Route path="/forgot" element={<ForgotPasswordSystem />} />
            <Route path="/bestseller1" element={<Bestsellerform1 setIsRegisterView={setIsRegisterView} />} />
            <Route path="/" element={
                <div className="app-container">
                    <div className="auth-card">
                        {/* Form Panel - slides left/right */}
                        <div className={`form-panel ${isRegisterView ? 'register-view' : 'login-view'}`}> 
                            {isRegisterView ? (
                                <RegisterForm 
                                    onRegisterSuccess={handleRegisterSuccess} 
                                    showMessage={showMessage} 
                                />
                            ) : (
                                <LoginForm 
                                    onLoginSuccess={handleLoginSuccess} 
                                    showMessage={showMessage}
                                />
                            )}
                        </div>
                        {/* Overlay Panel with Video Background */}
                        <div className={`overlay-panel ${isRegisterView ? 'register-view' : 'login-view'}`}> 
                            {/* Video Background */}
                            <video
                                className="video-background"
                                autoPlay
                                loop
                                muted
                                playsInline
                            >
                                <source src="/0fee2a39369b.mp4" type="video/mp4" />
                            </video>
                            {/* Content */}
                            <div className="overlay-content">
                                <div className="overlay-header">
                                    <h2>
                                        Welcome<br />ROM&ND
                                    </h2>
                                    <p>
                                        {isRegisterView 
                                            ? 'To keep connected with us please login with your personal info.'
                                            : 'Step into ROM&ND enter your details and shine beautifully!'
                                        }
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsRegisterView(!isRegisterView)}
                                    className="btn-toggle"
                                >
                                    {isRegisterView ? (
                                        <>
                                            <LogIn size={18} /> Log In
                                        </>
                                    ) : (
                                        <>
                                            Sign Up <UserPlus size={18} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                    {messageBox.visible && (
                        <MessageBox
                            title={messageBox.title}
                            body={messageBox.body}
                            isError={messageBox.isError}
                            onClose={() => setMessageBox({ ...messageBox, visible: false, body: '' })}
                        />
                    )}
                </div>
            } />
        </Routes>
    );
}