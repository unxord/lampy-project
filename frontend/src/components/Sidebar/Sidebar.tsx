import React, { useState, useEffect } from 'react';
import { Button, Alert } from 'react-bootstrap';
import styles from "./Sidebar.module.css";

import { useAuthStore } from '../../store/authStore';
import { loginUser, registerUser } from '../../services/api';
import { LoginData, RegisterData } from '../../types/api';

const Sidebar: React.FC = () => {
    const [visibleForm, setVisibleForm] = useState<'login' | 'register'>('login');
    const {
        isAuthenticated, user, isLoading, error,
        setTokens, setUser, clearAuth, setLoading, setError,
    } = useAuthStore();

    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const [registerUsername, setRegisterUsername] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState('')
    const [registrationSuccess, setRegistrationSuccess] = useState<string | null>(null);

    const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setRegistrationSuccess(null);
        const loginData: LoginData = { username: loginUsername, password: loginPassword };

        try {
            const response = await loginUser(loginData);
            setTokens({ access: response.access, refresh: response.refresh });
            setUser({ username: loginUsername, email: '' });
            console.log("Login successful!");
            setLoginUsername('');
            setLoginPassword('');
        } catch (err: any) {
            console.error("Login failed:", err);
            setError(err.message || "Произошла ошибка при входе.");
        } finally {
            
        }
    };

    const handleRegisterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setRegistrationSuccess(null);
        
        if (registerPassword !== registerPasswordConfirm) {
            setError("Пароли не совпадают.");
            setLoading(false);
            return;
        }
        
        const registerData: RegisterData = {
            username: registerUsername,
            email: registerEmail,
            password: registerPassword,
            password2: registerPasswordConfirm,
        };

        try {
            const response = await registerUser(registerData);
            console.log("Registration successful:", response);
            setRegistrationSuccess(response.message || "Регистрация прошла успешно! Теперь вы можете войти.");
            setRegisterUsername('');
            setRegisterEmail('');
            setRegisterPassword('');
            setRegisterPasswordConfirm('');
            setVisibleForm('login');
        } catch (err: any) {
            console.error("Registration failed:", err);
            setError(err.message || "Произошла ошибка при регистрации.");
        } finally {
            
        }
    };

    const handleLogout = () => {
        clearAuth();
        console.log("User logged out");
    };

    useEffect(() => {
        setError(null);
    }, [visibleForm, setError]);

    if (isAuthenticated) {
        return (
            <div className={styles.sidebar}>
                <div className={styles.col1}>
                     <h1>Профиль</h1>
                     <div className={styles.box}>
                         <p>Добро пожаловать, {user?.username || user?.email || 'пользователь'}!</p>
                         <Button
                             variant="outline-warning"
                             size="sm"
                             onClick={handleLogout}
                             disabled={isLoading}
                             className={styles.fullWidthButton}
                          >
                             {isLoading ? 'Выход...' : 'Выйти'}
                         </Button>
                     </div>
                </div>
                 <div className={styles.col1}>
                     <h1>Блок</h1>
                     <div className={styles.box}>
                         <p>Контент для вошедшего пользователя</p>
                     </div>
                 </div>
            </div>
        );
    }
    return (
        <div className={styles.sidebar}>
            <div className={styles.col1}>
                {visibleForm === 'login' && (
                    <div>
                        <h1>Авторизация</h1>
                        <div className={styles.box}>
                            {registrationSuccess && visibleForm === 'login' && (
                                <Alert id="auth-error" variant="success" className="mb-3"
                                onClose={() => setRegistrationSuccess(null)}
                                onClick={() => setRegistrationSuccess(null)}
                                style={{ cursor: 'pointer' }}
                                >{registrationSuccess}</Alert>
                            )}
                            {error && 
                                <Alert id="auth-error" variant="danger"
                                onClose={() => setError(null)}
                                onClick={() => setError(null)}
                                style={{ cursor: 'pointer' }}
                                >{error}</Alert>}
                            <form onSubmit={handleLoginSubmit}>
                                <label>Имя пользователя:</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={loginUsername}
                                    onChange={(e) => setLoginUsername(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                                <label>Пароль:</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                                <Button type="submit" variant="secondary" size="sm" className={styles.fullWidthButton} disabled={isLoading}>
                                        {isLoading ? 'Вход...' : 'Войти'}
                                </Button>
                                <Button variant="outline-warning" size="sm" onClick={() => setVisibleForm('register')} className={styles.fullWidthButton} disabled={isLoading}>
                                    Создать лампу!
                                </Button>
                            </form>
                        </div>
                    </div>
                )}
                {visibleForm === 'register' && (
                    <div>
                        <h1>Регистрация</h1>
                        <div className={styles.box}>
                            {error && <Alert id="auth-error" variant="danger"
                            onClose={() => setError(null)}
                            onClick={() => setError(null)}
                            style={{ cursor: 'pointer' }}
                            >{error}</Alert>}
                            <form onSubmit={handleRegisterSubmit}>
                                <label htmlFor="register-login">Имя пользователя:</label>
                                <input
                                    id="register-login"
                                    type="text"
                                    name="login"
                                    value={registerUsername}
                                    onChange={(e) => setRegisterUsername(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                                <label htmlFor="register-email">E-mail:</label>
                                <input
                                    id="register-email"
                                    type="email"
                                    name="email"
                                    value={registerEmail}
                                    onChange={(e) => setRegisterEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                                <label htmlFor="register-password">Пароль:</label>
                                <input
                                    id="register-password"
                                    type="password"
                                    name="password"
                                    value={registerPassword}
                                    onChange={(e) => setRegisterPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    disabled={isLoading}
                                />
                                <label htmlFor="register-password-confirm">Подтверждение пароля:</label>
                                <input
                                    id="register-password-confirm"
                                    type="password"
                                    name="password-confirm"
                                    value={registerPasswordConfirm}
                                    onChange={(e) => setRegisterPasswordConfirm(e.target.value)}
                                    required
                                    minLength={8}
                                    disabled={isLoading}
                                />
                                    <Button type="submit" variant="secondary" size="sm" className={styles.fullWidthButton} disabled={isLoading}>
                                        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                                    </Button>
                                    <Button variant="outline-warning" size="sm" onClick={() => setVisibleForm('login')} className={styles.fullWidthButton} disabled={isLoading}>
                                        Уже есть лампа?
                                    </Button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
            <div className={styles.col1}>
                <h1>Блок</h1>
                <div className={styles.box}>
                    <p>Здесь будет размещен какой-то контент</p>
                    <p>Дополнительная информация появится позже</p>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;