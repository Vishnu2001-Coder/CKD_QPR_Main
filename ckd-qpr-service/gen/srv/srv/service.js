const cds = require('@sap/cds');
const { SELECT } = require('@sap/cds/lib/ql/cds-ql');

module.exports = cds.service.impl(async function () {

    const {

        QPRs,
        QPRItems,
        QPRAttachments

    } = this.entities;

    this.before('CREATE', QPRs, async (req) => {

        const { qprNumber } = req.data; 
        console.log("Hi Vishnu");      
        console.log(req.data);
        
        req.data.qprNumber = await genrateQPRNumber(qprNumber, req);
        // console.log(req.data.qprNumber);

    });


    this.on('CREATE', QPRs, async (req) => {
        await INSERT.into(QPRs).entries(req.data);
        return req.data.qprNumber;
    });

    //helper methods
    async function genrateQPRNumber(qprNo, req) {

        const countries = {
            "Afghanistan": { code: "AF", value: "AFG" },
            "Albania": { code: "AL", value: "ALB" },
            "Algeria": { code: "DZ", value: "DZA" },
            "Andorra": { code: "AD", value: "AND" },
            "Angola": { code: "AO", value: "AGO" },
            "Argentina": { code: "AR", value: "ARG" },
            "Armenia": { code: "AM", value: "ARM" },
            "Australia": { code: "AU", value: "AUS" },
            "Austria": { code: "AT", value: "AUT" },
            "Azerbaijan": { code: "AZ", value: "AZE" },

            "Bangladesh": { code: "BD", value: "BGD" },
            "Belgium": { code: "BE", value: "BEL" },
            "Brazil": { code: "BR", value: "BRA" },
            "Canada": { code: "CA", value: "CAN" },
            "China": { code: "CN", value: "CHN" },
            "Denmark": { code: "DK", value: "DNK" },
            "Egypt": { code: "EG", value: "EGY" },
            "Finland": { code: "FI", value: "FIN" },
            "France": { code: "FR", value: "FRA" },
            "Germany": { code: "DE", value: "DEU" },

            "Greece": { code: "GR", value: "GRC" },
            "India": { code: "IN", value: "IND" },
            "Indonesia": { code: "ID", value: "IDN" },
            "Ireland": { code: "IE", value: "IRL" },
            "Israel": { code: "IL", value: "ISR" },
            "Italy": { code: "IT", value: "ITA" },
            "Japan": { code: "JP", value: "JPN" },
            "Malaysia": { code: "MY", value: "MYS" },
            "Mexico": { code: "MX", value: "MEX" },
            "Netherlands": { code: "NL", value: "NLD" },

            "New Zealand": { code: "NZ", value: "NZL" },
            "Norway": { code: "NO", value: "NOR" },
            "Pakistan": { code: "PK", value: "PAK" },
            "Philippines": { code: "PH", value: "PHL" },
            "Poland": { code: "PL", value: "POL" },
            "Portugal": { code: "PT", value: "PRT" },
            "Russia": { code: "RU", value: "RUS" },
            "Saudi Arabia": { code: "SA", value: "SAU" },
            "Singapore": { code: "SG", value: "SGP" },
            "South Africa": { code: "ZA", value: "ZAF" },

            "South Korea": { code: "KR", value: "KOR" },
            "Spain": { code: "ES", value: "ESP" },
            "Sri Lanka": { code: "LK", value: "LKA" },
            "Sweden": { code: "SE", value: "SWE" },
            "Switzerland": { code: "CH", value: "CHE" },
            "Thailand": { code: "TH", value: "THA" },
            "Turkey": { code: "TR", value: "TUR" },
            "Ukraine": { code: "UA", value: "UKR" },
            "United Arab Emirates": { code: "AE", value: "ARE" },
            "United Kingdom": { code: "GB", value: "GBR" },
            "United States": { code: "US", value: "USA" },
            "Vietnam": { code: "VN", value: "VNM" }
        };

        let number = "QPR_";
        let countryCode = countries[req.data.country].value;

        let plantName = req.data.plant;
        plantName = plantName.slice(0, 3).toUpperCase();

        let serials = await SELECT('qprNumber').from(QPRs);
        let formattedDate;

        if (serials.length === 0) {

            number += countryCode;
            number += '1_';
            number += '001_';
            number += plantName;
            number += '_';

            const date = new Date();
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            formattedDate = `${day}${month}${year}`;

            number += formattedDate;


        } else {

            for (s of serials) s.qprNumber = Number(s.qprNumber.slice(9, 12));

            serials.sort((a, b) => b.qprNumber - a.qprNumber);
            let previousSerial = serials[0].qprNumber + 1;

            if (previousSerial < 10)
                previousSerial = '00' + previousSerial;
            else if (previousSerial > 9 && previousSerial < 100)
                previousSerial = '0' + previousSerial;

            number += countryCode;
            number += '1_';
            number += previousSerial + '_';
            number += plantName;
            number += '_';


            const date = new Date();
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();

            formattedDate = `${day}${month}${year}`;
            number += formattedDate;

        }

        return number;

    }

});