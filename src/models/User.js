const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        areasOfInterest: {
  type: [String],
  validate: {
    validator: function (val) {
      return val.length <= 3;
    },
    message: "You can select maximum 3 areas of interest"
    }
    },

        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true
        },
        companyWebsite: {
             type: String,
             default: null
        },

    },
    
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
