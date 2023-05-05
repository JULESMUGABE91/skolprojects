const answerMongo = require("./answer.mongo");
const questionMongo = require("../question/question.mongo");

module.exports = async () => {
  // try {
  //   let data = [
  //     {
  //       user: "643a6f72196354dd18fdd11f",
  //       identifier: "63ffb22a731970d4c34689d2__2p3pl1681823235384",
  //       wrong_gender: "Gabo",
  //       correct_gender: "Gore",
  //     },
  //     {
  //       user: "643a6f72196354dd18fdd11f",
  //       identifier: "63ffb22a731970d4c34689d2__vatg31681826166024",
  //       wrong_gender: "Gabo",
  //       correct_gender: "Gore",
  //     },
  //     {
  //       user: "643a6f72196354dd18fdd11f",
  //       identifier: "63ffb22a731970d4c34689d2__w4cdm1681841699085",
  //       wrong_gender: "Gabo",
  //       correct_gender: "Gore",
  //     },
  //     {
  //       user: "643a6f72196354dd18fdd11f",
  //       identifier: "63ffb22a731970d4c34689d2__5yuxf1681897003199",
  //       wrong_gender: "Gabo",
  //       correct_gender: "Gore",
  //     },
  //     {
  //       user: "643a6f72196354dd18fdd11f",
  //       identifier: "63ffb22a731970d4c34689d2__nvjwx1681901660378",
  //       wrong_gender: "Gabo",
  //       correct_gender: "Gore",
  //     },
  //     {
  //       user: "643a6f72196354dd18fdd11f",
  //       identifier: "63ffb22a731970d4c34689d2__t75381681909269246",
  //       wrong_gender: "Gabo",
  //       correct_gender: "Gore",
  //     },
  //     {
  //       user: "643a6f72196354dd18fdd11f",
  //       identifier: "63ffb22a731970d4c34689d2__bymt11681917639997",
  //       wrong_gender: "Gabo",
  //       correct_gender: "Gore",
  //     },
  //     {
  //       user: "643a6f72196354dd18fdd11f",
  //       identifier: "63ffb22a731970d4c34689d2__3cdr31681919180454",
  //       wrong_gender: "Gabo",
  //       correct_gender: "Gore",
  //     },
  //     {
  //       user: "643a6f72196354dd18fdd11f",
  //       identifier: "63ffb22a731970d4c34689d2__u5gee1681972839104",
  //       wrong_gender: "Gabo",
  //       correct_gender: "Gore",
  //     },
  //     {
  //       user: "643a6f72196354dd18fdd11f",
  //       identifier: "63ffb22a731970d4c34689d2__p0x7n1681973385488",
  //       wrong_gender: "Gabo",
  //       correct_gender: "Gore",
  //     },
  //     {
  //       user: "643a6f72196354dd18fdd11f",
  //       identifier: "63ffb22a731970d4c34689d2__3tbg91681973979189",
  //       wrong_gender: "Gabo",
  //       correct_gender: "Gore",
  //     },
  //     {
  //       user: "643a6f72196354dd18fdd11f",
  //       identifier: "63ffb22a731970d4c34689d2__q3c9n1681975313788",
  //       wrong_gender: "Gabo",
  //       correct_gender: "Gore",
  //     },
  //     {
  //       user: "643a6f72196354dd18fdd11f",
  //       identifier: "63ffb22a731970d4c34689d2__p58n51681980760780",
  //       wrong_gender: "Gabo",
  //       correct_gender: "Gore",
  //     },
  //     {
  //       user: "643a6f72196354dd18fdd11f",
  //       identifier: "63ffb22a731970d4c34689d2__lrxro1681986542731",
  //       wrong_gender: "Gabo",
  //       correct_gender: "Gore",
  //     },

  //     {
  //       user: "643a6f72196354dd18fdd11f",
  //       identifier: "63ffb22a731970d4c34689d2__355vf1682068565965",
  //       wrong_gender: "Gabo",
  //       correct_gender: "Gore",
  //     },
  //     {
  //       user: "643a6f72196354dd18fdd11f",
  //       identifier: "63ffb22a731970d4c34689d2__7nyex1682069157453",
  //       wrong_gender: "Gabo",
  //       correct_gender: "Gore",
  //     },
  //     {
  //       user: "643a6f72196354dd18fdd11f",
  //       identifier: "63ffb22a731970d4c34689d2__awbil1682072518594",
  //       wrong_gender: "Gabo",
  //       correct_gender: "Gore",
  //     },
  //     {
  //       user: "643a6f72196354dd18fdd11f",
  //       identifier: "63ffb22a731970d4c34689d2__6tas21682075146521",
  //       wrong_gender: "Gabo",
  //       correct_gender: "Gore",
  //     },
  //     {
  //       user: "643a6f72196354dd18fdd11f",
  //       identifier: "63ffb22a731970d4c34689d2__7708b1682079327168",
  //       wrong_gender: "Gabo",
  //       correct_gender: "Gore",
  //     },
  //     {
  //       user: "643a6f72196354dd18fdd11f",
  //       identifier: "63ffb22a731970d4c34689d2__3wc9p1682147026721",
  //       wrong_gender: "Gabo",
  //       correct_gender: "Gore",
  //     },
  //     {
  //       user: "643a6f72196354dd18fdd11f",
  //       identifier: "63ffb22a731970d4c34689d2__bpdh31682147803414",
  //       wrong_gender: "Gabo",
  //       correct_gender: "Gore",
  //     },
  //     {
  //       user: "643a6f72196354dd18fdd11f",
  //       identifier: "63ffb22a731970d4c34689d2__40gvu1682173233257",
  //       wrong_gender: "Gabo",
  //       correct_gender: "Gore",
  //     },
  //     {
  //       user: "643a6f72196354dd18fdd11f",
  //       identifier: "63ffb22a731970d4c34689d2__ras3p1682177980838",
  //       wrong_gender: "Gabo",
  //       correct_gender: "Gore",
  //     },
  //     {
  //       user: "643a6f72196354dd18fdd11f",
  //       identifier: "63ffb22a731970d4c34689d2__is2wt1682182474191",
  //       wrong_gender: "Gabo",
  //       correct_gender: "Gore",
  //     },
  //     {
  //       user: "643a6f72196354dd18fdd11f",
  //       identifier: "63ffb22a731970d4c34689d2__z0ml11682240882691",
  //       wrong_gender: "Gabo",
  //       correct_gender: "Gore",
  //     },
  //     {
  //       user: "643a6f72196354dd18fdd11f",
  //       identifier: "63ffb22a731970d4c34689d2__by0lk1682241448249",
  //       wrong_gender: "Gabo",
  //       correct_gender: "Gore",
  //     },
  //     {
  //       user: "643a6f72196354dd18fdd11f",
  //       identifier: "63ffb22a731970d4c34689d2__ou0661682245484070",
  //       wrong_gender: "Gabo",
  //       correct_gender: "Gore",
  //     },
  //     {
  //       user: "643a6f72196354dd18fdd11f",
  //       identifier: "63ffb22a731970d4c34689d2__hrsiq1682248268899",
  //       wrong_gender: "Gabo",
  //       correct_gender: "Gore",
  //     },
  //     {
  //       user: "643a6f72196354dd18fdd11f",
  //       identifier: "63ffb22a731970d4c34689d2__t6bu91682266687570",
  //       wrong_gender: "Gabo",
  //       correct_gender: "Gore",
  //     },
  //   ];

  //   const updatePromises = [];
  //   for (const ans of data) {
  //     const answers = await answerMongo
  //       .find({ user: ans.user, identifier: ans.identifier })
  //       .populate({
  //         path: "question",
  //         model: questionMongo,
  //         select: { type: 1 },
  //       });

  //     const answerPromises = [];
  //     for (const el of answers) {
  //       if (el.question.type === "respondent_gender") {
  //         answerPromises.push(
  //           answerMongo.updateOne(
  //             { _id: el._id, "answers.option": ans.wrong_gender },
  //             { $set: { "answers.$.option": ans.correct_gender } }
  //           )
  //         );
  //       }

  //       answerPromises.push(
  //         answerMongo.findByIdAndUpdate(
  //           el._id,
  //           { gender: ans.correct_gender },
  //           { new: true }
  //         )
  //       );
  //     }

  //     updatePromises.push(Promise.all(answerPromises));
  //   }

  //   return "success";
  // } catch (error) {
  //   console.log(error.stack);
  //   return error.stack;
  // }

  //  try {
  //    let users = [
  //      {
  //        user: "6426b18703bbc70fe70daa3e",
  //        correct: "Kigali Rural",
  //        correct_kin: "Kigali mu nyengero",
  //        wrong: "Kigali Urban",
  //        wrong_kin: "Kigali y'umugi",
  //      },
  //      {
  //        user: "64268d2f03bbc70fe70da26d",
  //        correct: "Kigali Rural",
  //        correct_kin: "Kigali mu nyengero",
  //        wrong: "Kigali Urban",
  //        wrong_kin: "Kigali y'umugi",
  //      },
  //      {
  //        user: "64268a3303bbc70fe70d9fc9",
  //        correct: "Kigali Rural",
  //        correct_kin: "Kigali mu nyengero",
  //        wrong: "Kigali Urban",
  //        wrong_kin: "Kigali y'umugi",
  //      },
  //      {
  //        user: "64268d8303bbc70fe70da2c9",
  //        correct: "Kigali Rural",
  //        correct_kin: "Kigali mu nyengero",
  //        wrong: "Kigali Urban",
  //        wrong_kin: "Kigali y'umugi",
  //      },
  //      {
  //        user: "64268d8303bbc70fe70da2c9",
  //        correct: "Kigali Rural",
  //        correct_kin: "Kigali mu nyengero",
  //        wrong: "Regional Urban",
  //        wrong_kin: "Umugi w'akarere",
  //      },
  //      {
  //        user: "6426908903bbc70fe70da59e",
  //        correct: "Kigali Rural",
  //        correct_kin: "Kigali mu nyengero",
  //        wrong: "Kigali Urban",
  //        wrong_kin: "Kigali y'umugi",
  //      },
  //      {
  //        user: "64268dd003bbc70fe70da352",
  //        correct: "Kigali Rural",
  //        correct_kin: "Kigali mu nyengero",
  //        wrong: "Kigali Urban",
  //        wrong_kin: "Kigali y'umugi",
  //      },
  //      {
  //        user: "64268dd003bbc70fe70da352",
  //        correct: "Kigali Rural",
  //        correct_kin: "Kigali mu nyengero",
  //        wrong: "Regional Rural",
  //        wrong_kin: "Icyaro cyakarere",
  //      },
  //    ];

  //    let count = 0;

  //    for (let user of users) {
  //      const answers = await answerMongo.find({ user: user.user }).populate({
  //        path: "question",
  //        model: questionMongo,
  //        select: { type: 1 },
  //      });

  //      for (let ans of answers) {
  //        let { _id } = ans;

  //        if (
  //          ans.question.type === "respondent_region" &&
  //          (ans.answers[0].option === user.wrong ||
  //            ans.answers[0].option === user.wrong_kin)
  //        ) {
  //          let key =
  //            ans.answers[0].option === user.wrong_kin
  //              ? user.correct_kin
  //              : user.correct;

  //          let wrong_key =
  //            ans.answers[0].option === user.wrong_kin
  //              ? user.wrong_kin
  //              : user.wrong;

  //          await answerMongo.update(
  //            {
  //              _id,
  //              "answers.option": wrong_key,
  //            },
  //            { $set: { "answers.$.option": key } }
  //          );

  //          count += 1;
  //        }

  //        await answerMongo.findByIdAndUpdate(
  //          { _id },
  //          {
  //            region: user.correct,
  //          }
  //        );
  //      }
  //    }

  //    return "success";
  //  } catch (error) {
  //    console.log(error.stack);
  //    return error;
  //  }
};


