const DOMAIN_NAME = "http://myskol.rw";

 const inputs = [
   "name",
   "phone_number",
   "address",
   "age",
   "textinput",
   "number",
   "respondent_name",
   "respondent_phone_number",
   "respondent_address",
   "respondent_age",
   "respondent_textinput",
   "respondent_number",
   "interviewer_name",
   "interviewer_id",
 ];

 const responderInfoFields = [
   "respondent_name",
   "respondent_phone_number",
   "respondent_address",
   "respondent_age",
   "respondent_gender",
   "respondent_region",
 ];

 const gender = [
   {
     label: "Male",
     value: "Male",
   },
   {
     label: "Female",
     value: "Female",
   },
   {
     label: "Gabo",
     value: "Male",
   },
   {
     label: "Gore",
     value: "Female",
   },
 ];

 const regions = [
   {
     label: "Kigali Urban",
     value: "Kigali Urban",
   },
   {
     label: "Kigali Rural",
     value: "Kigali Rural",
   },
   {
     label: "Regional Urban",
     value: "Regional Urban",
   },
   {
     label: "Regional Rural",
     value: "Regional Rural",
   },
   {
     label: "Kigali y'umugi",
     value: "Kigali Urban",
   },
   {
     label: "Umugi w'akarere",
     value: "Regional Urban",
   },
   {
     label: "Kigali mu nyengero",
     value: "Kigali Rural",
   },
   {
     label: "Icyaro cy'akarere",
     value: "Regional Rural",
   },
 ];

 module.exports = {
   DOMAIN_NAME,
   gender,
   regions,
   inputs,
   responderInfoFields,
 };
