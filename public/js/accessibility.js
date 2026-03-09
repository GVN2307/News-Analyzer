/**
 * Speech Recognition and Synthesis Wrapper for News Analyzer
 */

const accessibility = {
    recognition: null,
    synth: window.speechSynthesis,

    initSpeech() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;

            // Map common language codes to speech codes
            const langMap = {
                'en': 'en-US',
                'hi': 'hi-IN',
                'ta': 'ta-IN',
                'te': 'te-IN',
                'bn': 'bn-IN'
            };
            this.recognition.lang = langMap[localStorage.getItem('prefs-lang')] || 'en-US';

            this.recognition.onresult = (event) => {
                const text = event.results[0][0].transcript;
                if (this.onResultCallback) this.onResultCallback(text);
            };

            this.recognition.onerror = (event) => {
                console.error("Speech Recognition Error:", event.error);
                if (this.onErrorCallback) this.onErrorCallback(event.error);
            };
        }
    },

    startListening(callback, errorCallback) {
        this.onResultCallback = callback;
        this.onErrorCallback = errorCallback;
        if (this.recognition) {
            this.recognition.lang = this.getLocaleCode();
            this.recognition.start();
        } else {
            console.error("Speech Recognition not supported in this browser.");
        }
    },

    stopListening() {
        if (this.recognition) this.recognition.stop();
    },

    speak(text) {
        if (!text) return;
        this.synth.cancel(); // Stop any current speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = this.getLocaleCode();
        utterance.rate = 0.9; // Slightly slower for better clarity
        this.synth.speak(utterance);
    },

    getLocaleCode() {
        const lang = localStorage.getItem('prefs-lang') || 'en';
        const langMap = {
            'en': 'en-US',
            'hi': 'hi-IN',
            'ta': 'ta-IN',
            'te': 'te-IN',
            'bn': 'bn-IN'
        };
        return langMap[lang] || 'en-US';
    }
};

accessibility.initSpeech();
window.accessibility = accessibility;
