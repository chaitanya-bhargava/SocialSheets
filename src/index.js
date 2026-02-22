import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { ToastProvider } from './components/Toast/ToastContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <ErrorBoundary>
            <ToastProvider>
                <App />
            </ToastProvider>
        </ErrorBoundary>
    </Provider>
);

