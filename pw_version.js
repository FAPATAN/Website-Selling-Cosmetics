import React, { useState } from 'react';
import { Mail, Lock, User, Phone, MapPin, Loader2, LogIn, UserPlus } from 'lucide-react';
import './App.css';


// Helper function to conditionally join classes
const cx = (...classes) => classes.filter(Boolean).join(' ');

const MessageBox = ({ title, body, isError, onClose }) => {
    if (!body) return null;

    return (
        <div className="message-box-backdrop">
            <div className="message-box-content">
                <h3 className={isError ? "message-box-title-error" : "message-box-title-success"}>
                    {title}
                </h3>
                <p className="message-box-body">{body}</p>
                <button 
                    onClick={onClose}
                    className={cx("message-box-button", isError ? "error" : "success")}
                >
                    ตกลง
                </button>
            </div>
        </div>
    );
};

const InputField = ({ label, id, type = 'text', value, onChange, required = false, icon: Icon, placeholder = '' }) => (
    <div className="input-field-container">
        <div className="input-wrapper">
            {Icon && <Icon className="input-icon" />}
            <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder || label}
                className="app-input"
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

    const handleRegister = async () => { /* Logic remains the same */
        setMessage('');
        setIsLoading(true);

        if (password !== confirmPassword) {
            setMessage('❌ รหัสผ่านในช่อง Password และ Confirm Password ไม่ตรงกัน');
            setIsLoading(false);
            return;
        }

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
        <div className="form-content">
            <h2 className="form-title">Sign Up Here</h2>
            
            {message && (
                <p className={cx(
                    'message-inline',
                    message.startsWith('❌') ? 'error-message-inline' : 'success-message-inline'
                )} style={{
                    // Retaining specific inline styles for immediate feedback colors based on message content
                    padding: '8px',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    fontSize: '13px',
                    backgroundColor: message.startsWith('❌') ? '#fee2e2' : '#d1fae5',
                    color: message.startsWith('❌') ? '#dc2626' : '#065f46'
                }}>
                    {message}
                </p>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <InputField label="ชื่อ" id="name" value={name} onChange={(e) => setName(e.target.value)} required icon={User} />
                <InputField label="นามสกุล" id="surname" value={surname} onChange={(e) => setSurname(e.target.value)} required icon={User} />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <InputField label="อีเมล" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required icon={Mail} />
                <InputField label="เบอร์โทรศัพท์" id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required icon={Phone} />
            </div>

            <div className="input-field-container">
                <div className="input-wrapper">
                    <MapPin className="input-icon" style={{ top: '13px' }} />
                    <textarea
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows="2"
                        placeholder="ที่อยู่"
                        className="app-input address-textarea"
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <InputField label="ชื่อผู้ใช้งาน" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required icon={User} />
                <InputField label="รหัสผ่าน" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required icon={Lock} />
                <InputField label="ยืนยันรหัสผ่าน" id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required icon={Lock} />
            </div>

            <button
                onClick={handleRegister}
                disabled={isLoading}
                className="auth-button"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="spinner-icon" style={{ 
                            width: '18px', 
                            height: '18px',
                            animation: 'spin 1s linear infinite'
                        }} /> 
                        Registering...
                    </>
                ) : (
                    'Register'
                )}
            </button>

            <div className="social-login-separator">
                or use your account
            </div>
            
            <div className="social-buttons">
                {['F', 'G', 'T'].map((letter, i) => (
                    <button 
                        key={i}
                        className="social-button"
                    >
                        {letter}
                    </button>
                ))}
            </div>
        </div>
    );
};

const LoginForm = ({ onLoginSuccess, showMessage }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => { /* Logic remains the same */
        setError('');
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
        <div className="form-content" style={{ justifyContent: 'center' }}>
            <h2 className="login-title">Log In Here</h2>
            
            {error && (
                <p className="error-message-inline" style={{
                    // Retaining specific inline styles for immediate feedback colors
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    fontSize: '14px',
                    backgroundColor: '#fee2e2',
                    color: '#dc2626'
                }}>
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
                    <label className="remember-me-label">
                        <input type="checkbox" style={{ width: '16px', height: '16px' }} />
                        <span>Remember Me</span>
                    </label>
                    <a href="#" className="forgot-password-link">
                        Forgot your password?
                    </a>
                </div>
            </div>

            <button
                onClick={handleLogin}
                disabled={isLoading}
                className="auth-button login-button"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="spinner-icon" style={{ 
                            width: '20px', 
                            height: '20px',
                            animation: 'spin 1s linear infinite'
                        }} /> 
                        Logging In...
                    </>
                ) : (
                    'Log In'
                )}
            </button>

            <div className="social-login-separator" style={{ margin: '24px 0' }}>
                or use your account
            </div>
            
            <div className="social-buttons" style={{ gap: '16px' }}>
                {['F', 'G', 'T'].map((letter, i) => (
                    <button 
                        key={i}
                        className="social-button"
                        style={{ width: '40px', height: '40px', fontSize: '16px' }}
                    >
                        {letter}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default function App() {
    const [isRegisterView, setIsRegisterView] = useState(true);
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
        <div className="app-container">
            <div className="auth-card">
                
                {/* Form Panel - slides left/right */}
                <div className={cx("form-panel", isRegisterView ? "register-view" : "login-view")}>
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
                <div className={cx("overlay-panel", isRegisterView ? "register-view" : "login-view")}>
                    
                    {/* Video Background */}
                    <video
                        className="video-background"
                        autoPlay
                        loop
                        muted
                        playsInline
                        onError={(e) => console.error("Video load error:", e.currentTarget.error)}
                    >
                        <source src="/0fee2a39369b.mp4" type="video/mp4" />
                    </video>
                    
                    {/* Content */}
                    <div className="overlay-content">
                        <div>
                            <h2 className="overlay-title">
                                Welcome<br />ROM&ND
                            </h2>
                            <p className="overlay-text">
                                {isRegisterView 
                                    ? 'To keep connected with us please login with your personal info.'
                                    : 'Step into ROM&ND enter your details and shine beautifully!'
                                }
                            </p>
                        </div>
                        
                        <button
                            onClick={() => setIsRegisterView(!isRegisterView)}
                            className="overlay-button"
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
            
            <style>{`
                /* Move the @keyframes spin to a CSS file as shown above */
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}