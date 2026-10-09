const cds = require('@sap/cds');
// const { useInsertionEffect } = require('react');

module.exports = cds.service.impl(async function () {

    const {

        QPRs,
        QPRItems,
        QPRAttachments

    } = this.entities;

    this.before('CREATE', QPRs, async (req) => {

        const { qprNumber } = req.data;
        req.data.qprNumber = await genrateQPRNumber(qprNumber, req);
        console.log(req.data.qprNumber);


    });

    this.on('CREATE', QPRs, async (req) => {

        await INSERT.into(QPRs).entries(req.data);

    });

    this.before('UPDATE', 'QPRs', validateQPR);

    function validateQPR(req) {

        const {
            qprNumber,
            dateOfContainerReceipt,
            unpackingDate,
            country,
            department,
            plant,
            status
        } = req.data;

        if (!qprNumber) {
            req.error(400, 'QPR Number is required', 'qprNumber');
        }

        if (qprNumber && qprNumber.length > 30) {
            req.error(400, 'QPR Number cannot exceed 30 characters', 'qprNumber');
        }

        if (!dateOfContainerReceipt) {
            req.error(
                400,
                'Container receipt date is required',
                'dateOfContainerReceipt'
            );
        }

        if (dateOfContainerReceipt && unpackingDate) {

            if (new Date(unpackingDate) < new Date(dateOfContainerReceipt)) {
                req.error(
                    400,
                    'Unpacking date cannot be before container receipt date',
                    'unpackingDate'
                );
            }
        }

        if (!country) {
            req.error(400, 'Country is required', 'country');
        }

        if (!plant) {
            req.error(400, 'Plant is required', 'plant');
        }

        if (!department) {
            req.error(400, 'Department is required', 'department');
        }

        if (status && ![
            'DRAFT',
            'SUBMITTED',
            'IN_PROGRESS',
            'COMPLETED',
            'REJECTED'
        ].includes(status)) {
            req.error(400, 'Invalid QPR status', 'status');
        }
    }

    this.before('CREATE', 'QPRItems', validateQPRItem);
    this.before('UPDATE', 'QPRItems', validateQPRItem);

    function validateQPRItem(req) {

        const {
            caseNumber,
            invoiceQuantity,
            claimQuantity,
            uom,
            partCondition,
            packagingCondition,
            natureOfDefect,
            replacementOrRework
        } = req.data;

        if (!caseNumber) {
            req.error(400, 'Case number is required', 'caseNumber');
        }

        if (!uom) {
            req.error(400, 'Unit of measurement is required', 'uom');
        }

        if (invoiceQuantity == null) {
            req.error(
                400,
                'Invoice quantity is required',
                'invoiceQuantity'
            );
        }

        if (claimQuantity == null) {
            req.error(
                400,
                'Claim quantity is required',
                'claimQuantity'
            );
        }

        if (invoiceQuantity != null && invoiceQuantity < 0) {
            req.error(
                400,
                'Invoice quantity cannot be negative',
                'invoiceQuantity'
            );
        }

        if (claimQuantity != null && claimQuantity < 0) {
            req.error(
                400,
                'Claim quantity cannot be negative',
                'claimQuantity'
            );
        }

        if (
            invoiceQuantity != null &&
            claimQuantity != null &&
            claimQuantity > invoiceQuantity
        ) {
            req.error(
                400,
                'Claim quantity cannot be greater than invoice quantity',
                'claimQuantity'
            );
        }

        if (!partCondition) {
            req.error(
                400,
                'Part condition is required',
                'partCondition'
            );
        }

        if (!packagingCondition) {
            req.error(
                400,
                'Packaging condition is required',
                'packagingCondition'
            );
        }

        if (!natureOfDefect) {
            req.error(
                400,
                'Nature of defect is required',
                'natureOfDefect'
            );
        }

        if (!replacementOrRework) {
            req.error(
                400,
                'Replacement or rework is required',
                'replacementOrRework'
            );
        }
    }


    this.before('CREATE', 'QPRAttachments', validateAttachment);
    this.before('UPDATE', 'QPRAttachments', validateAttachment);

    function validateAttachment(req) {

        const {
            fileName,
            fileType,
            fileContent
        } = req.data;

        if (!fileName) {
            req.error(400, 'File name is required', 'fileName');
        }

        if (!fileType) {
            req.error(400, 'File type is required', 'fileType');
        }

        if (!fileContent) {
            req.error(400, 'File content is required', 'fileContent');
        }
        // Allowed file types
        const allowedTypes = [
            'application/pdf',
            'image/jpeg',
            'image/png'
        ];
        if (
            fileType &&
            !allowedTypes.includes(fileType)
        ) {
            req.error(
                400,
                'Only PDF, JPG and PNG files are allowed',
                'fileType'
            );
        }
    }

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
        let countryCode = countries[req.data.country].code;
        let serial = await SELECT('qprNumber').from(QPRs).orderBy('qprNumber desc').limit(1).qprNumber;
        let plantName = req.data.plant;
        plantName = plantName.slice(0, 3).toUpperCase();
        let formattedDate;

        if (!serial) {

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

            number += countryCode;
            number += '1_';

            if (serial < 9) {
                number += '0'
                number += serial + 1;
            } else {
                number += serial + 1;
            }
            number += plantName;
            number += '_';

            const date = new Date();
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            formattedDate = `${day}${month}${year}`;

            number += formattedDate;
        }
        return number;
    }

});