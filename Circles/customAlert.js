/**
 * CustomAlert Module
 * 
 * This module provides a custom alert dialog that can be used to display messages
 * without exiting fullscreen mode. It creates a modal dialog with a message and
 * an OK button to dismiss the alert.
 * 
 * Usage:
 * - Import the CustomAlert class: `import CustomAlert from './customAlert.js';`
 * - Create an instance of CustomAlert: `const customAlert = new CustomAlert();`
 * - Show the alert with a message: `customAlert.show('Your message here');`
 * - Hide the alert: `customAlert.hide();`
 * 
 * The class automatically appends the necessary HTML and CSS to the document.
 * 
 * Example:
 * 
 * import CustomAlert from './customAlert.js';
 * 
 * document.addEventListener('DOMContentLoaded', () => {
 *     const customAlert = new CustomAlert();
 *     customAlert.show('This is a custom alert!');
 * });
 * 
 * Methods:
 * - show(message): Displays the alert with the specified message.
 * - hide(): Hides the alert.
 * 
 * CSS Classes:
 * - custom-alert-modal: Styles for the modal background.
 * - custom-alert-modal-content: Styles for the modal content.
 * - custom-alert-close-btn: Styles for the close button.
 */
class CustomAlert {
    constructor() {
        this.modal = document.createElement('div');
        this.modal.classList.add('custom-alert-modal');
        this.modal.innerHTML = `
            <div class="custom-alert-modal-content">
                <p id="custom-alert-alert-message"></p>
                <button class="custom-alert-close-btn" id="custom-alert-close-btn">OK</button>
            </div>
        `;
        document.body.appendChild(this.modal);
  
        const style = document.createElement('style');
        style.textContent = `
        .custom-alert-modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0, 0, 0, 0.5);
        }
        .custom-alert-modal-content {
            background-color: #fefefe;
            margin: 15% auto;
            padding: 20px;
            border: 1px solid #888;
            width: 80%;
            max-width: 460px;
            text-align: center;
            border-radius: 5px;
        }
        .custom-alert-close-btn {
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            border: none;
            cursor: pointer;
        }
        `;
        document.head.appendChild(style);
  
        this.closeButton = this.modal.querySelector('#custom-alert-close-btn');
        this.closeButton.addEventListener('click', () => this.hide());
        window.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.hide();
            }
        });
    }
  
    show(message) {
        this.modal.querySelector('#custom-alert-alert-message').textContent = message;
        this.modal.style.display = 'block';
    }
  
    hide() {
        this.modal.style.display = 'none';
    }
  }
  
  export default CustomAlert;
  