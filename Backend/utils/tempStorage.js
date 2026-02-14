class TempStorage {
    constructor() {
        this.storage = new Map();
    }

    // Store the OTP with an automatic deletion after a set timeout
    set(email, otp, duration = 1000 * 60 * 5) { // Default duration to 5 minutes
        this.storage.set(email, otp);
        setTimeout(() => this.storage.delete(email), duration);
    }

    // Verify the OTP for a given email
    verify(email, otp) {
        return this.storage.get(email) === String(otp);
    }

    // Manually delete an entry
    delete(email) {
        this.storage.delete(email);
    }

    // Get all stored entries (useful for debugging)
    getAll() {
        return this.storage;
    }
}

// Export the TempStorage instance
module.exports = new TempStorage();
