import React from "react";
import { Button } from 'react-bootstrap';
import styles from "./Sidebar.module.css";

const Sidebar: React.FC = () => {
    return (
        <div className={styles.sidebar}>
            <div className={styles.col1}>
                <h1>Авторизация</h1>
                <div className={styles.box}>
					<form>
						<div>
							<label htmlFor="email">E-mail:</label>
							<input type="email" id="email" name="email" />
						</div>
						<div>
							<label htmlFor="password">Пароль:</label>
							<input type="password" id="password" name="password" />
						</div>
						<Button href="#" variant="secondary" size="sm" className={styles.fullWidthButton}>Войти</Button>
					</form>
				</div>
				<h1>Регистрация</h1>
                <div className={styles.box}>
                    <form>
                        <div>
                            <label htmlFor="register-email">E-mail:</label>
                            <input type="email" id="register-email" name="email" />
                        </div>
                        <div>
                            <label htmlFor="register-login">Логин:</label>
                            <input type="text" id="register-login" name="login" />
                        </div>
                        <div>
                            <label htmlFor="register-password">Пароль:</label>
                            <input type="password" id="register-password" name="password" />
                        </div>
                        <div>
                            <label htmlFor="register-password-confirm">Подтверждение пароля:</label>
                            <input type="password" id="register-password-confirm" name="password-confirm" />
                        </div>
                        <Button href="#" variant="secondary" size="sm" className={styles.fullWidthButton}>Зарегистрироваться</Button>
                    </form>
                </div>
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