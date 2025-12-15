const mongoose = require('mongoose');

const SiteContentSchema = new mongoose.Schema({
    contactInfo: {
        phone: String,
        email: String,
        address: {
            en: String,
            ar: String
        },
        workingHours: {
            en: String,
            ar: String
        },
        socials: {
            facebook: String,
            twitter: String,
            instagram: String,
            linkedin: String
        }
    },
    heroImages: [String],
    videos: {
        about: String,
        whyChooseUs: String
    },
    stats: [{
        number: String,
        label: String,
        labelAr: String
    }],
    whyChooseUs: [{
        title: String,
        titleAr: String,
        desc: String
    }],
    company: {
        name: String,
        nameAr: String,
        shortName: String,
        founded: String,
        experience: String,
        tagline: String,
        taglineAr: String,
        description: String,
        descriptionAr: String
    }
}, { timestamps: true });

// Ensure only one document exists
SiteContentSchema.statics.getSingleton = async function () {
    const doc = await this.findOne();
    if (doc) {
        return doc;
    }
    return this.create({});
};

module.exports = mongoose.model('SiteContent', SiteContentSchema);
