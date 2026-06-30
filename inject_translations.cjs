const fs = require('fs');
const path = require('path');

const dfPath = path.join(__dirname, 'src/translations/index.js');
let content = fs.readFileSync(dfPath, 'utf8');

// We'll use regex to inject translations for Tamil and Hindi, as a demo of "everything changing"
const taAdditions = `
    "dfWhatDonating": "நீங்கள் என்ன தானம் செய்கிறீர்கள்?",
    "dfCategory": "வகை",
    "dfCookedMeals": "சமைத்த உணவு",
    "dfQuantity": "அளவு (கிலோ)",
    "dfEstImpact": "மதிப்பிடப்பட்ட தாக்கம்",
    "dfPickupDetails": "பிக்அப் விவரங்கள்",
    "dfPickupAddress": "பிக்அப் முகவரி",
    "dfContactNumber": "தொடர்பு எண்",
    "dfConfirmDispatch": "உறுதி செய் & அனுப்பு",
    "sosFormReq": "🆘 அவசர உணவு தேவை",
    "sosWhoNeeds": "🙏 யாருக்கு உணவு தேவை?",
    "sosReqName": "கோரிக்கையாளர் பெயர் *",
    "sosCategory": "தேவையின் வகை *",
    "sosNumPeople": "நபர்களின் எண்ணிக்கை *",
    "sosUrgency": "அவசர நிலை *",
    "sosLocTitle": "📍 இருப்பிடம் & தொடர்பு",
    "sosAddress": "முழு முகவரி *",
    "sosSend": "🆘 அவசர கோரிக்கையை அனுப்பு",
`;

const hiAdditions = `
    "dfWhatDonating": "आप क्या दान कर रहे हैं?",
    "dfCategory": "श्रेणी",
    "dfCookedMeals": "पका हुआ भोजन",
    "dfQuantity": "मात्रा (किलो)",
    "dfEstImpact": "अनुमानित प्रभाव",
    "dfPickupDetails": "पिकअप विवरण",
    "dfPickupAddress": "पिकअप पता",
    "dfContactNumber": "संपर्क नंबर",
    "dfConfirmDispatch": "पुष्टि करें और भेजें",
    "sosFormReq": "🆘 आपातकालीन भोजन अनुरोध",
    "sosWhoNeeds": "🙏 किसे भोजन चाहिए?",
    "sosReqName": "अनुरोधकर्ता का नाम *",
    "sosCategory": "ज़रूरत की श्रेणी *",
    "sosNumPeople": "लोगों की संख्या *",
    "sosUrgency": "तात्कालिकता *",
    "sosLocTitle": "📍 स्थान और संपर्क",
    "sosAddress": "पूरा पता *",
    "sosSend": "🆘 आपातकालीन अनुरोध भेजें",
`;

content = content.replace('"ta": {', '"ta": {' + taAdditions);
content = content.replace('"hi": {', '"hi": {' + hiAdditions);

fs.writeFileSync(dfPath, content, 'utf8');
console.log('Translations merged!');
