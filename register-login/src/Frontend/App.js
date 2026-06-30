import React, { useState } from 'react';
import { Mail, Lock, User, Phone, MapPin, Loader2, LogIn, UserPlus } from 'lucide-react';
import './App.css';
const API = process.env.REACT_APP_API_URL;

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
                    ปิด
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
    const [pwFocused, setPwFocused] = useState(false);

    const pwRules = {
        length: password.length >= 8,
        upper:  /[A-Z]/.test(password),
        lower:  /[a-z]/.test(password),
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');

        // Validate required fields
        if (!name || !surname || !email || !phone || !username || !password || !confirmPassword) {
            setMessage('? กรุณากรอกข้อมูลให้ครบถ้วน');
            showMessage('ข้อมูลไม่ครบ', 'โปรดกรอกข้อมูลทั้งหมดก่อนส่งแบบฟอร์ม', true);
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage('? กรุณาใส่อีเมลให้ถูกต้อง');
            showMessage('อีเมลไม่ถูกต้อง', 'โปรดใส่อีเมลในรูปแบบที่ถูกต้อง', true);
            return;
        }

        // Validate password match
        if (password !== confirmPassword) {
            setMessage('? รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
            showMessage('รหัสผ่านไม่ตรงกัน', 'กรุณาตรวจสอบรหัสผ่านและยืนยันรหัสผ่านให้ตรงกัน', true);
            return;
        }

        // Validate password rules
        if (!pwRules.length || !pwRules.upper || !pwRules.lower) {
            const missing = [];
            if (!pwRules.length) missing.push('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');
            if (!pwRules.upper)  missing.push('ต้องมีตัวพิมพ์ใหญ่ (A-Z)');
            if (!pwRules.lower)  missing.push('ต้องมีตัวพิมพ์เล็ก (a-z)');
            setMessage('? รหัสผ่านไม่เป็นไปตามเกณฑ์ที่กำหนด');
            showMessage('ข้อผิดพลาดของรหัสผ่าน', `ข้อกำหนด: ${missing.join(', ')}`, true);
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
            const response = await fetch(`${API}/api/insert`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registrationData),
            });

            const data = await response.json();

            if (response.ok) {
                showMessage('สมัครสมาชิกสำเร็จ!', 'สมัครสมาชิกเรียบร้อยแล้ว! คุณสามารถเข้าสู่ระบบเพื่อใช้งานได้ทันที', false);
                setUsername(''); setEmail(''); setPassword(''); setConfirmPassword('');
                setName(''); setSurname(''); setPhone(''); setAddress('');
                setTimeout(onRegisterSuccess, 1000);
            } else {
                const errorMsg = data.error || data.msg || 'เกิดข้อผิดพลาดในการสมัครสมาชิก';
                setMessage(`? เกิดข้อผิดพลาด: ${errorMsg}`);
                showMessage('เกิดข้อผิดพลาด', errorMsg, true);
            }
        } catch (error) {
            console.error('Registration failed:', error);
            setMessage('? เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
            showMessage('เกิดข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อกับ backend ได้ โปรดลองอีกครั้ง', true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="form-container" onSubmit={handleRegister}>
            <h2 className="form-title">สมัครสมาชิก</h2>
            
            {message && (
                <p className={`alert-message ${message.startsWith('?') ? 'error' : 'success'}`}>
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

            <InputField label="ชื่อผู้ใช้" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required icon={User} />

            <div
                className="pw-field-wrapper"
                onFocus={() => setPwFocused(true)}
                onBlur={() => setPwFocused(false)}
            >
                <InputField label="รหัสผ่าน" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required icon={Lock} />
                {pwFocused && (
                    <div className="pw-rules-popover">
                        <span className={pwRules.length ? 'pw-rule ok' : 'pw-rule'}>
                            {pwRules.length ? '✓' : '✗'} รหัสผ่านต้องมี 8 ตัวอักษรขึ้นไป
                        </span>
                        <span className={pwRules.upper ? 'pw-rule ok' : 'pw-rule'}>
                            {pwRules.upper ? '✓' : '✗'} ต้องมีตัวพิมพ์ใหญ่ (A-Z)
                        </span>
                        <span className={pwRules.lower ? 'pw-rule ok' : 'pw-rule'}>
                            {pwRules.lower ? '✓' : '✗'} ต้องมีตัวพิมพ์เล็ก (a-z)
                        </span>
                    </div>
                )}
            </div>

            <InputField label="ยืนยันรหัสผ่าน" id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required icon={Lock} />

            <button
                type="submit"
                disabled={isLoading}
                className="btn-primary"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="btn-icon spinning" /> 
                        กำลังสมัครสมาชิก...
                    </>
                ) : (
                    'สมัครสมาชิก'
                )}
            </button>


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
                setError(`? ${errorMessage}`);
                showMessage('ข้อมูลไม่ครบ', errorMessage, true);
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                const errorMessage = 'รูปแบบอีเมลไม่ถูกต้อง';
                setError(`? ${errorMessage}`);
                showMessage('อีเมลไม่ถูกต้อง', 'โปรดใส่อีเมลในรูปแบบที่ถูกต้อง', true);

        try {
            const response = await fetch(`${API}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.userRole === "A") {
                    sessionStorage.setItem("admin_Member_id", data.Member_id ? data.Member_id : "");
                    sessionStorage.setItem("admin_userEmail", email);
                    sessionStorage.setItem("admin_username", data.username || "");
                } else {
                    sessionStorage.setItem("userEmail", email);
                    sessionStorage.setItem("Member_id", data.Member_id ? data.Member_id : "");
                    sessionStorage.setItem("username",  data.username  || "");
                    sessionStorage.setItem("userRole",  data.userRole  || "U");
                }
                showMessage('ยินดีต้อนรับ', `เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับ ${data.username || email}`, false);
                if (onLoginSuccess) {
                    onLoginSuccess({ email, role: data.userRole });
                }
                setTimeout(() => {
                    window.location.href = data.userRole === "A" ? "/admin" : "/";
                }, 1000);
            } else {
                const errorMessage = data.message || 'ไม่สามารถเข้าสู่ระบบได้';
                setError(`? ${errorMessage}`);
                showMessage('เกิดข้อผิดพลาด', errorMessage, true);
            }
        } catch (error) {
            console.error('Login failed:', error);
            const connectionError = 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้';
            setError(`? ${connectionError}`);
            showMessage('เกิดข้อผิดพลาด', connectionError, true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="login-form-container" onSubmit={handleLogin}>
            <h2 className="form-title login-form-title">เข้าสู่ระบบ</h2>
            
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
                placeholder="กรุณากรอกอีเมลของคุณ" 
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
                    placeholder="กรุณากรอกรหัสผ่าน" 
                />

            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="btn-primary login"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="btn-icon login spinning" /> 
                        กำลังเข้าสู่ระบบ...
                    </>
                ) : (
                    'เข้าสู่ระบบ'
                )}
            </button>


        </form>
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
                                    <LogIn size={18} /> เข้าสู่ระบบ
                                </>
                            ) : (
                                <>
                                    สมัครสมาชิก <UserPlus size={18} />
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
    );
}
}
