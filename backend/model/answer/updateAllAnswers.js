const { default: mongoose } = require("mongoose");
const userMongo = require("../users/user.mongo");
const answerMongo = require("./answer.mongo");

const DATA = [
  {
    _id: "643a6de9196354dd18fdce8d",
    organization: "63fdf074095f8bc0e023ee15",
    phone: "250783578837",
    account_type: "normal",
    isPhoneVerified: true,
    isEmailVerified: false,
    badge: "family",
    country: "Rwanda",
    createdAt: "2023-04-15T09:27:05.144+0000",
    updatedAt: "2023-04-15T10:04:32.025+0000",

    age: 26,
    email: "ndahimanafrederic25@gmail.com",
    firstname: "Frederic ",
    gender: "Male",
    lastname: "NDAHIMANA ",
    cell: "Rurara",
    district: "Rutsiro",
    province: "West",
    sector: "Mushonyi",
    village: "Ruhengeri",
  },
  {
    _id: "643a6e0d196354dd18fdcea2",
    organization: "63fdf074095f8bc0e023ee15",
    phone: "250786233254",
    account_type: "normal",
    isPhoneVerified: true,
    isEmailVerified: false,
    badge: "family",
    country: "Rwanda",
    createdAt: "2023-04-15T09:27:41.154+0000",
    updatedAt: "2023-04-15T10:01:43.061+0000",

    age: 28,
    email: "emmanueltuyishime9@gmail.com",
    firstname: "Emmanuel ",
    gender: "Male",
    lastname: "Tuyishime ",
    cell: "Gaseke",
    district: "Ngororero",
    province: "West",
    sector: "Kabaya",
    village: "Rugari",
  },
  {
    _id: "643a6e1b196354dd18fdced0",
    organization: "63fdf074095f8bc0e023ee15",
    phone: "250787081950",
    account_type: "normal",
    isPhoneVerified: true,
    isEmailVerified: false,
    badge: "family",
    country: "Rwanda",
    createdAt: "2023-04-15T09:27:55.938+0000",
    updatedAt: "2023-04-15T10:04:30.807+0000",

    age: 26,
    email: "estherumuganwa1@gmail.com",
    firstname: "Esther ",
    gender: "Female",
    lastname: "UMUGANWA ",
    cell: "Cyarwa",
    district: "Huye",
    province: "South",
    sector: "Tumba",
    village: "Agasengasenge",
  },
  {
    _id: "643a6e1e196354dd18fdcedf",
    organization: "63fdf074095f8bc0e023ee15",
    phone: "250789073854",
    account_type: "normal",
    isPhoneVerified: true,
    isEmailVerified: false,
    badge: "explorer",
    country: "Rwanda",
    createdAt: "2023-04-15T09:27:58.393+0000",
    updatedAt: "2023-04-15T09:27:58.393+0000",
    __v: 0,
  },
  {
    _id: "643a6e34196354dd18fdcef9",
    organization: "63fdf074095f8bc0e023ee15",
    phone: "250792505150",
    account_type: "normal",
    isPhoneVerified: true,
    isEmailVerified: false,
    badge: "family",
    country: "Rwanda",
    createdAt: "2023-04-15T09:28:20.230+0000",
    updatedAt: "2023-04-15T10:06:26.609+0000",

    age: 23,
    email: "dgaju67@gmail.com",
    firstname: "Diego ",
    gender: "Male",
    lastname: "Gaju",
    cell: "Kayumba",
    district: "Bugesera",
    province: "East",
    sector: "Nyamata",
    village: "Rwanza",
  },
  {
    _id: "643a6e60196354dd18fdcf10",
    organization: "63fdf074095f8bc0e023ee15",
    phone: "250791547638",
    account_type: "normal",
    isPhoneVerified: true,
    isEmailVerified: false,
    badge: "family",
    country: "Rwanda",
    createdAt: "2023-04-15T09:29:04.121+0000",
    updatedAt: "2023-04-15T10:02:32.166+0000",

    email: "hirwcarine@gmail.com",
    firstname: "Umunezezi hirwa ",
    lastname: "Carine ",
    age: 20,
    gender: "Female",
    cell: "Ngarama",
    district: "Gatsibo",
    province: "East",
    sector: "Ngarama",
    village: "Intsinzi",
  },
  {
    _id: "643a6e7e196354dd18fdcf30",
    organization: "63fdf074095f8bc0e023ee15",
    phone: "250783447016",
    account_type: "normal",
    isPhoneVerified: true,
    isEmailVerified: false,
    badge: "family",
    country: "Rwanda",
    createdAt: "2023-04-15T09:29:34.957+0000",
    updatedAt: "2023-04-15T17:14:42.226+0000",

    email: "rukjacques@gmail.com",
    firstname: "RUKUNDO ",
    lastname: "Jacques ",
    age: 25,
    gender: "Male",
    cell: "Nyange",
    district: "Rusizi",
    province: "West",
    sector: "Bugarama",
    village: "Misufi",
    file: "http://res.cloudinary.com/dwqhmch33/image/upload/v1681578881/skol/qcq2qxror3oupz7trz9z.jpg",
  },
  {
    _id: "643a6ea1196354dd18fdcf4e",
    organization: "63fdf074095f8bc0e023ee15",
    phone: "250780455113",
    account_type: "normal",
    isPhoneVerified: true,
    isEmailVerified: false,
    badge: "family",
    country: "Rwanda",
    createdAt: "2023-04-15T09:30:09.132+0000",
    updatedAt: "2023-04-16T14:13:16.289+0000",

    email: "ukwishatsecyprien@gmail.com",
    firstname: "Cyprien ",
    lastname: "Ukwishatse ",
    age: 25,
    gender: "Male",
    cell: "Ngiryi",
    district: "Nyamagabe",
    province: "South",
    sector: "Gasaka",
    village: "Kitazigurwa",
    file: "http://res.cloudinary.com/dwqhmch33/image/upload/v1681557268/skol/jk11hjpr4tkm3e27bwtl.jpg",
  },
  {
    _id: "643a6ec9196354dd18fdd001",
    organization: "63fdf074095f8bc0e023ee15",
    phone: "250789553799",
    account_type: "normal",
    isPhoneVerified: true,
    isEmailVerified: false,
    badge: "family",
    country: "Rwanda",
    createdAt: "2023-04-15T09:30:49.418+0000",
    updatedAt: "2023-04-15T10:04:45.424+0000",

    age: 27,
    email: "niyigenaedo@gmail.com",
    firstname: "Edouard ",
    gender: "Male",
    lastname: "NIYIGENA ",
    cell: "Kigabiro",
    district: "Ngoma",
    province: "East",
    sector: "Murama",
    village: "Mutara",
  },
  {
    _id: "643a6ef7196354dd18fdd085",
    organization: "63fdf074095f8bc0e023ee15",
    phone: "250787689925",
    account_type: "normal",
    isPhoneVerified: true,
    isEmailVerified: false,
    badge: "family",
    country: "Rwanda",
    createdAt: "2023-04-15T09:31:35.936+0000",
    updatedAt: "2023-04-15T09:35:01.689+0000",

    age: 26,
    email: "jacquesniyomwungeri15@gmail.com",
    firstname: "Niyomwungeri ",
    gender: "Male",
    lastname: "Jacques ",
    cell: "Kabare",
    district: "Rwamagana",
    province: "East",
    sector: "Muhazi",
    village: "Umunini",
  },
  {
    _id: "643a6efe196354dd18fdd099",
    organization: "63fdf074095f8bc0e023ee15",
    phone: "250780579041",
    account_type: "normal",
    isPhoneVerified: true,
    isEmailVerified: false,
    badge: "family",
    country: "Rwanda",
    createdAt: "2023-04-15T09:31:42.815+0000",
    updatedAt: "2023-04-16T13:44:20.083+0000",

    age: 26,
    email: "abizeyefab@gmail.com",
    firstname: "ABIZEYIMANA ",
    gender: "Male",
    lastname: "Fabrice ",
    cell: "Sheli",
    district: "Kamonyi",
    province: "South",
    sector: "Rugarika",
    village: "Karehe",
  },
  {
    _id: "643a6f0b196354dd18fdd0aa",
    organization: "63fdf074095f8bc0e023ee15",
    phone: "250788989830",
    account_type: "normal",
    isPhoneVerified: true,
    isEmailVerified: false,
    badge: "explorer",
    country: "Rwanda",
    createdAt: "2023-04-15T09:31:55.618+0000",
    updatedAt: "2023-04-15T09:31:55.618+0000",
    __v: 0,
  },
  {
    _id: "643a6f1f196354dd18fdd0bc",
    organization: "63fdf074095f8bc0e023ee15",
    phone: "250787410550",
    account_type: "normal",
    isPhoneVerified: true,
    isEmailVerified: false,
    badge: "family",
    country: "Rwanda",
    createdAt: "2023-04-15T09:32:15.083+0000",
    updatedAt: "2023-04-15T09:37:50.737+0000",

    email: "erastetwagirimana@gmail.com",
    firstname: "Eraste ",
    lastname: "TWAGIRIMANA ",
    age: 25,
    gender: "Male",
    cell: "Rukore",
    district: "Gakenke",
    province: "North",
    sector: "Cyabingo",
    village: "Muramba",
  },
  {
    _id: "643a6f4f196354dd18fdd10e",
    organization: "63fdf074095f8bc0e023ee15",
    phone: "250789796024",
    account_type: "normal",
    isPhoneVerified: true,
    isEmailVerified: false,
    badge: "family",
    country: "Rwanda",
    createdAt: "2023-04-15T09:33:03.659+0000",
    updatedAt: "2023-04-15T10:19:24.368+0000",

    age: 25,
    email: "",
    firstname: "Alphonse ",
    gender: "Male",
    lastname: "HABIMANA",
    cell: "Ruramba",
    district: "Nyaruguru",
    province: "South",
    sector: "Ruramba",
    village: "Bugizi",
  },
  {
    _id: "643a6f72196354dd18fdd11f",
    organization: "63fdf074095f8bc0e023ee15",
    phone: "250781265294",
    account_type: "normal",
    isPhoneVerified: true,
    isEmailVerified: false,
    badge: "family",
    country: "Rwanda",
    createdAt: "2023-04-15T09:33:38.491+0000",
    updatedAt: "2023-04-15T10:08:47.175+0000",

    email: "Uwihoreyestephano@gmail.com",
    firstname: "Stephano ",
    lastname: "Uwihoreye ",
    age: 25,
    gender: "Male",
    cell: "Bunyentongo",
    district: "Kayonza",
    province: "East",
    sector: "Murama",
    village: "Kagarama",
  },
  {
    _id: "643a6f9a196354dd18fdd18a",
    organization: "63fdf074095f8bc0e023ee15",
    phone: "250786567002",
    account_type: "normal",
    isPhoneVerified: true,
    isEmailVerified: false,
    badge: "family",
    country: "Rwanda",
    createdAt: "2023-04-15T09:34:18.474+0000",
    updatedAt: "2023-04-15T10:01:58.959+0000",

    age: 22,
    email: "onumugwaneza71@gmail.com",
    firstname: "Umugwaneza",
    gender: "Female",
    lastname: "Honorine",
    cell: "Rukoma",
    district: "Nyabihu",
    province: "West",
    sector: "Mukamira",
    village: "Gatare",
  },
  {
    _id: "643a6fe2196354dd18fdd332",
    organization: "63fdf074095f8bc0e023ee15",
    phone: "250783047277",
    account_type: "normal",
    isPhoneVerified: true,
    isEmailVerified: false,
    badge: "family",
    country: "Rwanda",
    createdAt: "2023-04-15T09:35:30.626+0000",
    updatedAt: "2023-04-15T10:05:37.759+0000",

    age: 27,
    email: "niyonshutianastase20@gmail.com",
    firstname: "Niyonshuti",
    gender: "Male",
    lastname: "Anastase",
    cell: "Kabuga",
    district: "Nyanza",
    province: "South",
    sector: "Nyagisozi",
    village: "Uwagisozi",
  },
  {
    _id: "643a7033196354dd18fdd372",
    organization: "63fdf074095f8bc0e023ee15",
    phone: "250786841717",
    account_type: "normal",
    isPhoneVerified: true,
    isEmailVerified: false,
    badge: "family",
    country: "Rwanda",
    createdAt: "2023-04-15T09:36:51.854+0000",
    updatedAt: "2023-04-15T10:03:25.035+0000",

    age: 24,
    email: "ndamagedieudonne@gmail.com",
    firstname: "Dieudonne",
    gender: "Male",
    lastname: "Ndamage",
    cell: "Ruhondo",
    district: "Gicumbi",
    province: "North",
    sector: "Ruvune",
    village: "Kirwa",
  },
  {
    _id: "643a70d2196354dd18fdd61c",
    organization: "63fdf074095f8bc0e023ee15",
    phone: "250786031440",
    account_type: "normal",
    isPhoneVerified: true,
    isEmailVerified: false,
    badge: "family",
    country: "Rwanda",
    createdAt: "2023-04-15T09:39:30.727+0000",
    updatedAt: "2023-04-15T10:03:51.469+0000",

    email: "victorkaran1807@gmail.com",
    firstname: "Victor ",
    lastname: "KARANGWA Munezero ",
    age: 22,
    gender: "Male",
    cell: "Gatsibo",
    district: "Burera",
    province: "North",
    sector: "Butaro",
    village: "Gatovu",
  },
  {
    _id: "643a75d6196354dd18fddefe",
    phone: "250787203914",
    account_type: "normal",
    isPhoneVerified: false,
    isEmailVerified: false,
    badge: "family",
    country: "Rwanda",
    createdAt: "2023-04-15T10:00:54.449+0000",
    updatedAt: "2023-04-16T17:54:41.826+0000",

    age: 27,
    email: "uwipascal15@gmail.com",
    firstname: "Pascal",
    gender: "Male",
    lastname: "UWINGENEYE",
    cell: "Kibogora",
    district: "Nyamasheke",
    province: "West",
    sector: "Kanjongo",
    village: "Gataba",
    file: "http://res.cloudinary.com/dwqhmch33/image/upload/v1681646682/skol/vf75joy1ls5823kwderw.jpg",
  },
  {
    _id: "643a75de196354dd18fddf67",
    organization: "63fdf074095f8bc0e023ee15",
    phone: "250780548919",
    account_type: "normal",
    isPhoneVerified: true,
    isEmailVerified: false,
    badge: "family",
    country: "Rwanda",
    createdAt: "2023-04-15T10:01:02.622+0000",
    updatedAt: "2023-04-15T10:07:08.647+0000",

    email: "musajuliette28@gmail.com",
    firstname: "Juliette",
    lastname: "Uwizeyimana",
    age: 24,
    gender: "Female",
    cell: "Biringaga",
    district: "Muhanga",
    province: "South",
    sector: "Cyeza",
    village: "Gatare",
  },
  {
    _id: "643a78c7196354dd18fde7fb",
    organization: "63fdf074095f8bc0e023ee15",
    phone: "250784806063",
    account_type: "normal",
    isPhoneVerified: true,
    isEmailVerified: false,
    badge: "explorer",
    country: "Rwanda",
    createdAt: "2023-04-15T10:13:27.465+0000",
    updatedAt: "2023-04-15T10:13:27.465+0000",
    __v: 0,
  },
];

module.exports = async (params) => {
  let group = {};

  for (let el of DATA) {
    const answers = await answerMongo.find({ user: el._id });

    if (!group[el.phone]) {
      group[el.phone] = 0;
    }

    if (answers.length > 0) {
      group[el.phone] += 1;
    }

    // if (users === 0) {
    //   await userMongo.create({
    //     _id: mongoose.Types.ObjectId(el._id),
    //     ...el,
    //   });
    // }
  }

  return group;

  //   const CHUNK_SIZE = 1000,
  //   {page} = params;

  // let skip = CHUNK_SIZE * (page - 1);
  //   const answers = await answerMongo.aggregate([
  //     {
  //       $lookup: {
  //         from: "questions",
  //         localField: "question",
  //         foreignField: "_id",
  //         as: "question",
  //       },
  //     },
  //     {
  //       $unwind: "$question",
  //     },
  //     {
  //       $project: {
  //         _id: 1,
  //         identifier: 1,
  //         "question.type": 1,
  //         answers: 1,
  //       },
  //     },
  //     {
  //       $skip: skip,
  //     },
  //     {
  //       $limit: CHUNK_SIZE,
  //     },
  //   ]);

  //   let groupData = {};

  //   for (let el of answers) {
  //     if (!groupData[el.identifier]) {
  //       groupData[el.identifier] = [];
  //     }

  //     groupData[el.identifier].push({
  //       _id: el._id,
  //       question: el.question,
  //       answers: el.answers,
  //     });
  //   }

  //   const bulkOperations = [];

  //   for (let el of Object.keys(groupData)) {
  //     for (let groupItem of groupData[el]) {
  //       if (groupItem.question.type === "respondent_gender") {
  //         const key = groupItem.answers[0].option;

  //         bulkOperations.push({
  //           updateMany: {
  //             filter: { identifier: el },
  //             update: { $set: { gender: key } },
  //           },
  //         });
  //       }

  //       if (groupItem.question.type === "respondent_age_group") {
  //         const key = groupItem.answers[0].option;

  //         bulkOperations.push({
  //           updateMany: {
  //             filter: { identifier: el },
  //             update: { $set: { ageGroup: key } },
  //           },
  //         });
  //       }

  //       if (groupItem.question.type === "respondent_region") {
  //         const key = groupItem.answers[0].option;

  //         bulkOperations.push({
  //           updateMany: {
  //             filter: { identifier: el },
  //             update: { $set: { region: key } },
  //           },
  //         });
  //       }
  //     }
  //   }

  //   if (bulkOperations.length > 0) {
  //     await answerMongo.bulkWrite(bulkOperations);
  //   }

  // const answers = answerMongo.aggregate([
  //   {
  //     $match: {
  //       status: { $ne: "incomplete" },
  //     },
  //   },
  //   {
  //     $project: {
  //       completionTime: { $subtract: ["$end_interview", "$start_interview"] },
  //     },
  //   },
  //   {
  //     $group: {
  //       _id: null,
  //       avgCompletionTime: { $avg: "$completionTime" },
  //       maxCompletionTime: { $max: "$completionTime" },
  //       minCompletionTime: { $min: "$completionTime" },
  //     },
  //   },
  // ]);

  // const answers = await answerMongo.aggregate([
  //   { $unwind: "$answers" },
  //   {
  //     $group: {
  //       _id: "$question",
  //       options: { $push: "$answers.option" },
  //     },
  //   },
  // ]);

  // This query groups survey responses by location and counts the number of responses in each location. You could then use this information to create a heatmap of survey responses. Note that this query assumes that the location data is stored in a "start_location" object with a "coordinates" field.

  // const answers = await answerMongo.aggregate([
  //   {
  //     $match: {
  //       "start_location.coordinates": { $exists: true },
  //     },
  //   },
  //   {
  //     $group: {
  //       _id: "$start_location",
  //       count: { $sum: 1 },
  //     },
  //   },
  // ]);

  // Get the average age of respondents:
  // const answers = await answerMongo.aggregate([
  //   {
  //     $lookup: {
  //       from: "questions",
  //       localField: "question",
  //       foreignField: "_id",
  //       as: "question",
  //     },
  //   },
  //   {
  //     $match: {
  //       ["question.type"]: "respondent_age_group",
  //     },
  //   },
  //   {
  //     $group: {
  //       _id: null,
  //       ageTotal: { $sum: "$answers.option" },
  //       count: { $sum: 1 },
  //     },
  //   },
  //   {
  //     $project: {
  //       _id: 0,
  //       averageAge: { $divide: ["$ageTotal", "$count"] },
  //     },
  //   },
  // ]);

  // return answers;

  // const answers = await answerMongo.find().populate({
  //   path: "question",
  //   model: questionMongo,
  //   select: { type: 1 },
  // });

  // let groupData = {};

  // for (let el of answers) {
  //   if (!groupData[el.identifier]) {
  //     groupData[el.identifier] = [];
  //   }

  //   groupData[el.identifier].push({
  //     _id: el._id,
  //     question: el.question,
  //     answers: el.answers,
  //   });
  // }

  // for (let el of Object.keys(groupData)) {
  //   for (let groupItem of groupData[el]) {
  //     if (groupItem.question.type === "respondent_gender") {
  //       const key = groupItem.answers[0].option;

  //       const fetchByIdentifier = await answerMongo.find({ identifier: el });

  //       for (let groupAnswer of fetchByIdentifier) {
  //         await answerMongo.findByIdAndUpdate(
  //           { _id: groupAnswer._id },
  //           { gender: key }
  //         );
  //       }
  //     }

  //     if (groupItem.question.type === "respondent_age_group") {
  //       const key = groupItem.answers[0].option;

  //       const fetchByIdentifier = await answerMongo.find({ identifier: el });

  //       for (let groupAnswer of fetchByIdentifier) {
  //         const a = await answerMongo.findByIdAndUpdate(
  //           { _id: groupAnswer._id },
  //           { ageGroup: key }
  //         );
  //       }
  //     }

  //     if (groupItem.question.type === "respondent_region") {
  //       const key = groupItem.answers[0].option;

  //       const fetchByIdentifier = await answerMongo.find({ identifier: el });

  //       for (let groupAnswer of fetchByIdentifier) {
  //         await answerMongo.findByIdAndUpdate(
  //           { _id: groupAnswer._id },
  //           { region: key }
  //         );
  //       }
  //     }
  //   }
  // }
};
