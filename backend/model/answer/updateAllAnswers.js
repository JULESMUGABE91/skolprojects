const answerMongo = require("./answer.mongo");
const questionMongo = require("../question/question.mongo");
const { default: mongoose } = require("mongoose");

module.exports = async (params) => {
  const data = [
    "63ffb22a731970d4c34689d2__2bme81680499552244",
    "63ffb22a731970d4c34689d2__jaln01680535226827",
    "63ffb22a731970d4c34689d2__5jl311680517525975",
    "63ffb22a731970d4c34689d2__dgsrf1680526063143",
    "63ffb22a731970d4c34689d2__dqe1f1680529862344",
    "63ffb22a731970d4c34689d2__elqqm1680510747647",
    "63ffb22a731970d4c34689d2__esrcl1680341864238",
    "63ffb22a731970d4c34689d2__f5bld1680512106270",
    "63ffb22a731970d4c34689d2__gopm01680526053459",
    "63ffb22a731970d4c34689d2__jaln01680535226827",
    "63ffb22a731970d4c34689d2__men121680516348418",
    "63ffb22a731970d4c34689d2__n9gq21680528050924",
    "63ffb22a731970d4c34689d2__ntdfh1680523654669",
    "63ffb22a731970d4c34689d2__p6pd51680533410464",
    "63ffb22a731970d4c34689d2__pbbmq1680535082706",
    "63ffb22a731970d4c34689d2__qld0e1680520655406",
    "63ffb22a731970d4c34689d2__qtg0y1680527862448",
    "63ffb22a731970d4c34689d2__tu6n21680507527194",
    "63ffdb94b551bc8aec516701__05cka1680532876109",
    "63ffdb94b551bc8aec516701__6v1nq1680533256470",
    "63ffdb94b551bc8aec516701__7ud3a1680531393472",
    "63ffdb94b551bc8aec516701__7zcq01680508103808",
    "63ffdb94b551bc8aec516701__8jckx1680527850382",
    "63ffdb94b551bc8aec516701__8pyfv1680520487401",
    "63ffdb94b551bc8aec516701__chuys1680525723895",
    "63ffdb94b551bc8aec516701__h26xq1680511077626",
    "63ffdb94b551bc8aec516701__i58fh1680529127613",
    "63ffdb94b551bc8aec516701__ijyll1680531444373",
    "63ffdb94b551bc8aec516701__lqw201680518760008",
  ];

  try {
    for (let el of data) {
      const answers = await answerMongo.find({ identifier: el });

      let last = answers.slice(33, answers.length);

      console.log(last.length);

      for (let dAns of last) {
        await answerMongo.findByIdAndDelete({ _id: dAns._id });
      }
    }

    return "All documents deleted successfully";
  } catch (error) {
    return error.stack;
  }

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


