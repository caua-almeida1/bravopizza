import { Icon } from "@iconify/react";
import backgroundLogo from "../../img/login/Bravo Pizza’s.png";
import horizontalLogo from "../../img/login/horizontalLogoo.svg";
import backgroundNoise from "../../img/login/backgroundNoise.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/loader.json";

function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();

        setLoading(true);

        setTimeout(() => {
            navigate("/", {
                state: {
                    fromLogin: true
                }
            });
        }, 1500);
    };
    return (

        <div className="ecom-login">
            {loading && (
                <div className="ecom-login-loading">

                    <div className="ecom-login-loading__content">

                        <Lottie
                            animationData={loadingAnimation}
                            loop
                            style={{ width: 110, height: 110 }}
                        />

                        <span className="ecom-login-loading__text">
                            Entrando<span className="dots"></span>
                        </span>

                    </div>

                </div>
            )}
            <img
                src={horizontalLogo}
                className="ecom-login__horizontal-logo"
            />

            {/* BACKGROUND */}
            <div className="ecom-login__background">
                <div className="ecom-login__circle1"></div>
                <div className="ecom-login__circle2"></div>
                <div className="ecom-login__circle3"></div>
                <div className="ecom-login__circle4"></div>
                <div className="ecom-login__circle5"></div>
                <div className="ecom-login__circle6"></div>
                <div className="ecom-login__circle7"></div>
                <div className="ecom-login__circle8"></div>
                <div className="ecom-login__circle9"></div>
            </div>

            {/* GRID */}
            <div className="ecom-login__floor-grid"></div>

            <img
                src={backgroundNoise}
                className="ecom-login__noise"
            />

            <svg width="0" height="0" style={{ position: "absolute" }}>
                <defs>
                    <filter
                        id="glass-distortion"
                        x="0%"
                        y="0%"
                        width="100%"
                        height="100%"
                    >
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.01 0.01"
                            numOctaves="2"
                            seed="92"
                            result="noise"
                        />

                        <feGaussianBlur
                            in="noise"
                            stdDeviation="2"
                            result="blurred"
                        />

                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="blurred"
                            scale="55"
                            xChannelSelector="R"
                            yChannelSelector="G"
                        />
                    </filter>
                </defs>
            </svg>

            <div className="ecom-login__glass-help">

                <Icon icon="ph:question-mark-bold" className="icon" />

            </div>

            {/* FORM */}
            <div className="ecom-login__content">
                {/* <img
                    src={backgroundLogo}
                    className="ecom-login__bg-logo"
                /> */}

                <form
                    className="ecom-login__form"
                    onSubmit={handleLogin}
                >
                    <div className="ecom-login__form-header">

                        <div className="ecom-login__form-titlebar">
                            Bravo Pizza's Login
                        </div>

                        <button
                            type="button"
                            className="ecom-login__form-close"
                            onClick={() => navigate("/")}
                        >
                            <Icon
                                icon="mdi:close"
                                width="18"
                            />
                        </button>

                    </div>
                    <div className="ecom-login__form-content">

                        <div className="ecom-login__title">
                            <h1>Seja Bem-Vindo</h1>
                        </div>

                        <div className="ecom-login__group">
                            <label>Email</label>

                            <div className="ecom-login__input-wrapper">
                                <Icon
                                    icon="solar:letter-linear"
                                    className="icon"
                                />

                                <input
                                    type="email"
                                    placeholder="Digite seu email"
                                />
                            </div>
                        </div>

                        <div className="ecom-login__group">
                            <label>Senha</label>

                            <div className="ecom-login__input-wrapper">
                                <Icon
                                    icon="solar:lock-password-linear"
                                    className="icon"
                                />

                                <input
                                    type="password"
                                    placeholder="Digite sua senha"
                                />
                            </div>
                        </div>

                        <div className="ecom-login__options">

                            <div className="ecom-login__remember">
                                <input
                                    type="checkbox"
                                    className="ecom-login__checkbox"
                                />

                                <span>Lembre de mim</span>
                            </div>

                            <button
                                type="button"
                                className="ecom-login__link"
                            >
                                Esqueceu Senha?
                            </button>

                        </div>

                        <button
                            type="submit"
                            className="ecom-login__submit"
                        >
                            Entrar
                        </button>

                        <div className="ecom-login__divider">
                            <span>Ou continue com</span>
                        </div>

                        <div className="ecom-login__socials">

                            <button
                                type="button"
                                className="ecom-login__social-btn"
                            >
                                <Icon
                                    icon="flat-color-icons:google"
                                    width="22"
                                />

                                <spam>Google</spam>
                            </button>

                            <button
                                type="button"
                                className="ecom-login__social-btn"
                            >
                                <Icon
                                    icon="ic:baseline-apple"
                                    width="22"
                                />
                                <spam>Apple</spam>
                            </button>

                        </div>

                        {/* FOOTER */}
                        <p className="ecom-login__footer">
                            Não possui uma conta?

                            <button
                                type="button"
                                className="ecom-login__link"
                            >
                                Cadastre-se
                            </button>
                        </p>
                    </div>
                </form>
                <div className="ecom-login__linkedin-card">

                    <div className="ecom-login__linkedin-inner">

                        <Icon
                            icon="mdi:github"
                            className="icon"
                        />

                        <span>caua.almeida1</span>

                    </div>

                </div>
            </div>

            <div className="ecom-login__copyright">

                <Icon
                    icon="mdi:copyright"
                    className="icon"
                />

                <span>Bravo Pizza's</span>

            </div>
        </div>
    );
}

export default Login;