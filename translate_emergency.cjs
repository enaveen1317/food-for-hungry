const fs = require('fs');
const path = require('path');

let dfPath = path.join(__dirname, 'src/pages/Emergency.jsx');
let content = fs.readFileSync(dfPath, 'utf8');

// Ensure useLanguage is imported
if (!content.includes('useLanguage')) {
  content = content.replace(
    `import requestBg from '../assets/request-bg.png';`,
    `import requestBg from '../assets/request-bg.png';\nimport { useLanguage } from '../context/LanguageContext';`
  );
  content = content.replace(
    `const Emergency = () => {`,
    `const Emergency = () => {\n  const { t } = useLanguage();`
  );
}

const replacements = [
  ['🆘 Emergency Food Request', "t('sosFormReq') || '🆘 Emergency Food Request'"],
  ['Request food support for families, shelters, elderly homes, or communities in need.', "t('sosFormTitle') || 'Request food support for families, shelters, elderly homes, or communities in need.'"],
  ['We respond to urgent requests within 30 minutes. All requests are verified.', "t('sosFormSub') || 'We respond to urgent requests within 30 minutes. All requests are verified.'"],
  ['Avg. Response Time', "t('sosFormAvg') || 'Avg. Response Time'"],
  ['SOS Request Sent! Help is coming. 🙏', "t('sosSentTitle') || 'SOS Request Sent! Help is coming. 🙏'"],
  ["Nearby volunteers have been notified. You'll receive a call within 30 minutes.", "t('sosSentSub') || 'Nearby volunteers have been notified. You\\'ll receive a call within 30 minutes.'"],
  ['🙏 Who Needs Food?', "t('sosWhoNeeds') || '🙏 Who Needs Food?'"],
  ['Requester Name *', "t('sosReqName') || 'Requester Name *'"],
  ['Organization (Optional)', "t('sosOrg') || 'Organization (Optional)'"],
  ['Category of Need *', "t('sosCategory') || 'Category of Need *'"],
  ['Individual / Family', "t('sosCat1') || 'Individual / Family'"],
  ['Shelter / Orphanage', "t('sosCat2') || 'Shelter / Orphanage'"],
  ['Old Age Home', "t('sosCat3') || 'Old Age Home'"],
  ['Street Community', "t('sosCat4') || 'Street Community'"],
  ['Disaster Relief', "t('sosCat5') || 'Disaster Relief'"],
  ['Number of People *', "t('sosNumPeople') || 'Number of People *'"],
  ['Meal Type', "t('sosMealType') || 'Meal Type'"],
  ['Any food', "t('sosMeal1') || 'Any food'"],
  ['Cooked Meal', "t('sosMeal2') || 'Cooked Meal'"],
  ['Dry Groceries', "t('sosMeal3') || 'Dry Groceries'"],
  ['Baby Food', "t('sosMeal4') || 'Baby Food'"],
  ['Urgency Level *', "t('sosUrgency') || 'Urgency Level *'"],
  ['🔴 Critical', "t('sosUrg1') || '🔴 Critical'"],
  ['🟠 High', "t('sosUrg2') || '🟠 High'"],
  ['🟡 Medium', "t('sosUrg3') || '🟡 Medium'"],
  ['Preferred Time', "t('sosPrefTime') || 'Preferred Time'"],
  ['📍 Location & Contact', "t('sosLocTitle') || '📍 Location & Contact'"],
  ['Full Address *', "t('sosAddress') || 'Full Address *'"],
  ['Landmark', "t('sosLandmark') || 'Landmark'"],
  ['Contact Phone *', "t('sosPhone') || 'Contact Phone *'"],
  ['Additional Notes', "t('sosNotes') || 'Additional Notes'"],
  ['⚡ Urgent? Use SOS Mode', "t('sosUrgentMode') || '⚡ Urgent? Use SOS Mode'"],
  ['SOS requests get priority and are dispatched within 30 minutes.', "t('sosModeSub') || 'SOS requests get priority and are dispatched within 30 minutes.'"],
  ['Submitting this request?', "t('sosSubmitTitle') || 'Submitting this request?'"],
  ['Our team will verify and dispatch help as soon as possible.', "t('sosSubmitSub') || 'Our team will verify and dispatch help as soon as possible.'"],
  ['Save Request', "t('sosSave') || 'Save Request'"],
  ['🆘 Send SOS Request', "t('sosSend') || '🆘 Send SOS Request'"]
];

for (let [search, replace] of replacements) {
  content = content.replace(new RegExp('>' + search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '<', 'g'), `>{${replace}}<`);
  content = content.replace(new RegExp('<option>' + search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '</option>', 'g'), `<option>{${replace}}</option>`);
  content = content.split(`>${search}<`).join(`>{${replace}}<`);
  content = content.split(`>${search}\\n`).join(`>{${replace}}\\n`);
}

fs.writeFileSync(dfPath, content, 'utf8');
console.log('Emergency.jsx translated!');
