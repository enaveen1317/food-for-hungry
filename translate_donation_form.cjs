const fs = require('fs');
const path = require('path');

let dfPath = path.join(__dirname, 'src/pages/DonationForm.jsx');
let content = fs.readFileSync(dfPath, 'utf8');

const replacements = [
  ['What are you donating?', "t('dfWhatDonating') || 'What are you donating?'"],
  ['Category', "t('dfCategory') || 'Category'"],
  ['Cooked Meals', "t('dfCookedMeals') || 'Cooked Meals'"],
  ['Raw Ingredients', "t('dfRawIngredients') || 'Raw Ingredients'"],
  ['Baked Goods / Bread', "t('dfBakedGoods') || 'Baked Goods / Bread'"],
  ['Packaged Food', "t('dfPackagedFood') || 'Packaged Food'"],
  ['Quantity (kg/portions)', "t('dfQuantity') || 'Quantity (kg/portions)'"],
  ['Estimated Impact', "t('dfEstImpact') || 'Estimated Impact'"],
  ['Freshness & Quality', "t('dfFreshness') || 'Freshness & Quality'"],
  ['Time Prepared', "t('dfTimePrep') || 'Time Prepared'"],
  ['Best Before', "t('dfBestBefore') || 'Best Before'"],
  ['Current Storage Condition', "t('dfStorage') || 'Current Storage Condition'"],
  ['Hot / Warm', "t('dfHotWarm') || 'Hot / Warm'"],
  ['Room Temp', "t('dfRoomTemp') || 'Room Temp'"],
  ['Refrigerated', "t('dfRefrigerated') || 'Refrigerated'"],
  ['Priority Pickup Recommended', "t('dfPriorityRec') || 'Priority Pickup Recommended'"],
  ['Pickup Details', "t('dfPickupDetails') || 'Pickup Details'"],
  ['Pickup Address', "t('dfPickupAddress') || 'Pickup Address'"],
  ['Contact Number', "t('dfContactNumber') || 'Contact Number'"],
  ['Available Window', "t('dfAvailableWindow') || 'Available Window'"],
  ['Packaging & Proof', "t('dfPackagingProof') || 'Packaging & Proof'"],
  ['Packaging Type', "t('dfPackagingType') || 'Packaging Type'"],
  ['Ready to Rescue!', "t('dfReadyRescue') || 'Ready to Rescue!'"],
  ['Review your details before dispatching to our network.', "t('dfReviewDetails') || 'Review your details before dispatching to our network.'"],
  ['Food Type', "t('dfFoodType') || 'Food Type'"],
  ['Wedding Meals (Cooked)', "t('dfWeddingMeals') || 'Wedding Meals (Cooked)'"],
  ['20 Portions', "t('df20Portions') || '20 Portions'"],
  ['Pickup Area', "t('dfPickupArea') || 'Pickup Area'"],
  ['Anna Nagar, Chennai', "t('dfAnnaNagar') || 'Anna Nagar, Chennai'"],
  ['By submitting, you confirm the food is safe for human consumption and was handled safely.', "t('dfConfirmSafe') || 'By submitting, you confirm the food is safe for human consumption and was handled safely.'"],
  ['Next Step ', "t('dfNextStep') || 'Next Step '"],
  ['Back', "t('dfBack') || 'Back'"],
  ['Confirm & Dispatch', "t('dfConfirmDispatch') || 'Confirm & Dispatch'"]
];

for (let [search, replace] of replacements) {
  content = content.replace(new RegExp('>' + search + '<', 'g'), `>{${replace}}<`);
  content = content.replace(new RegExp('<option>' + search + '</option>', 'g'), `<option>{${replace}}</option>`);
  content = content.split(`>${search}<`).join(`>{${replace}}<`);
  content = content.split(`>${search}\\n`).join(`>{${replace}}\\n`);
}

// Ensure steps array is also translated
content = content.replace(`label: 'Food Info'`, `label: t('dfStep1') || 'Food Info'`);
content = content.replace(`label: 'Freshness'`, `label: t('dfStep2') || 'Freshness'`);
content = content.replace(`label: 'Pickup'`, `label: t('dfStep3') || 'Pickup'`);
content = content.replace(`label: 'Packaging'`, `label: t('dfStep4') || 'Packaging'`);
content = content.replace(`label: 'Review'`, `label: t('dfStep5') || 'Review'`);

fs.writeFileSync(dfPath, content, 'utf8');
console.log('DonationForm.jsx translated!');
