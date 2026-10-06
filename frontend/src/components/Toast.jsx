import { useEffect } from "react";
import "./Toast.css";

function Toast({ type = "success", message, onClose }) {

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`toast toast-${type}`}>

            <div className="toast-icon">
                {type === "success" ? "✓" : "✕"}
            </div>

            <div className="toast-content">
                <strong>
                    {type === "success" ? "Success" : "Error"}
                </strong>

                <span>{message}</span>
            </div>

            <button
                className="toast-close"
                onClick={onClose}
            >
                ×
            </button>

        </div>
    );
}

export default Toast;