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
                    ????
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
            setMessage('? ????????????????????????????');
            showMessage('????????????', '?????????????????????????????????????', true);
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage('? ?????????????????????');
            showMessage('???????????????', '????????????????????????????????', true);
            return;
        }

        // Validate password match
        if (password !== confirmPassword) {
            setMessage('? ?????????????? Password ??? Confirm Password ?????????');
            showMessage('?????????????????', '????????????????????????????????????????', true);
            return;
        }

        // Validate password rules
        if (!pwRules.length || !pwRules.upper || !pwRules.lower) {
            const missing = [];
            if (!pwRules.length) missing.push('????????? 8 ????????');
            if (!pwRules.upper)  missing.push('???????????? (A-Z)');
            if (!pwRules.lower)  missing.push('???????????? (a-z)');
            setMessage('? ?????????????????????????????????');
            showMessage('??????????????????????', `???????????: ${missing.join(', ')}`, true);
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
                showMessage('???????????????!', '??????????????????????! ??????????????????????????????', false);
                setUsername(''); setEmail(''); setPassword(''); setConfirmPassword('');
                setName(''); setSurname(''); setPhone(''); setAddress('');
                setTimeout(onRegisterSuccess, 1000);
            } else {
                const errorMsg = data.error || data.msg || '????????????????????????????';
                setMessage(`? ??????????????????: ${errorMsg}`);
                showMessage('??????????????????', errorMsg, true);
            }
        } catch (error) {
            console.error('Registration failed:', error);
            setMessage('? ???????????????????????????????????');
            showMessage('??????????', '??????????????????????????????????? ??????????????? Backend ?????????', true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="form-container" onSubmit={handleRegister}>
            <h2 className="form-title">Sign Up Here</h2>
            
            {message && (
                <p className={`alert-message ${message.startsWith('?') ? 'error' : 'success'}`}>
                    {message}
                </p>
            )}

            <div className="grid-2-cols">
                <InputField label="????" id="name" value={name} onChange={(e) => setName(e.target.value)} required icon={User} />
                <InputField label="???????" id="surname" value={surname} onChange={(e) => setSurname(e.target.value)} required icon={User} />
            </div>
            
            <div className="grid-2-cols">
                <InputField label="?????" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required icon={Mail} />
                <InputField label="?????????????" id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required icon={Phone} />
            </div>

            <div className="textarea-wrapper">
                <MapPin className="textarea-icon" />
                <textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows="2"
                    placeholder="???????"
                    className="textarea-field"
                />
            </div>

            <InputField label="?????????????" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required icon={User} />

            <div
                className="pw-field-wrapper"
                onFocus={() => setPwFocused(true)}
                onBlur={() => setPwFocused(false)}
            >
                <InputField label="????????" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required icon={Lock} />
                {pwFocused && (
                    <div className="pw-rules-popover">
                        <span className={pwRules.length ? 'pw-rule ok' : 'pw-rule'}>
                            {pwRules.length ? '?' : '?'} ????????? 8 ????????
                        </span>
                        <span className={pwRules.upper ? 'pw-rule ok' : 'pw-rule'}>
                            {pwRules.upper ? '?' : '?'} ???????????? (A-Z)
                        </span>
                        <span className={pwRules.lower ? 'pw-rule ok' : 'pw-rule'}>
                            {pwRules.lower ? '?' : '?'} ???????????? (a-z)
                        </span>
                    </div>
                )}
            </div>

            <InputField label="??????????????" id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required icon={Lock} />

            <button
                type="submit"
                disabled={isLoading}
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
            const errorMessage = '?????????????????????????';
            setError(`? ${errorMessage}`);
            showMessage('????????????', errorMessage, true);
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            const errorMessage = '?????????????????????';
            setError(`? ${errorMessage}`);
            showMessage('???????????????', '????????????????????????????????', true);
            return;
        }

        setIsLoading(true);

        const loginData = { Email: email, Password: password };

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
                showMessage('??????', `?????????????????! ???????????? ${data.username || email}`, false);
                if (onLoginSuccess) {
                    onLoginSuccess({ email, role: data.userRole });
                }
                setTimeout(() => {
                    window.location.href = data.userRole === "A" ? "/admin" : "/";
                }, 1000);
            } else {
                const errorMessage = data.message || '???????????????????????????';
                setError(`? ${errorMessage}`);
                showMessage('????????????????????', errorMessage, true);
            }
        } catch (error) {
            console.error('Login failed:', error);
            const connectionError = '???????????????????????????????????';
            setError(`? ${connectionError}`);
            showMessage('??????????', connectionError, true);
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
                label="?????" 
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
                    label="????????" 
                    id="login-password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    icon={Lock} 
                    placeholder="????????" 
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
                        Logging In...
                    </>
                ) : (
                    'Log In'
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
    );
}
