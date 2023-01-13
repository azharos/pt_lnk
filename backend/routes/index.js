const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const User = require("../model/user");
const Record = require("../model/record");
const saltRounds = 10;

const ACCESS_TOKEN = "fMSBan3hgVUTezW0mjvoFAxKy2oBTTuMfPuWQU7OAxFvIwpUsr";

router.get("/user", async function (req, res) {
	try {
		const data = jwt.decode(req.headers.auth);
		const v = await User.findById(data.id);
		return res.json({
			status: "SUCCESS",
			data: v,
		});
	} catch (error) {
		return res.json({
			status: "ERROR",
			data: error,
		});
	}
});

router.get("/logout", async function (req, res) {
	try {
		const auth = req.headers.auth;
		const now = new Date().getTime();

		const data = jwt.decode(auth);
		const record = await Record.findById(data.record_id);

		const login = record.login;
		const logout = now;
		const selisih = logout - login;

		// Update Record
		const mnt = Math.floor((selisih % (1000 * 60 * 60)) / (1000 * 60));
		const dtk = Math.floor((selisih % (1000 * 60)) / 1000);

		// hitung detik
		const time = mnt * 60 + dtk;

		// 15 mnt = 900dtk
		// 30 mnt = 1800dtk
		// 45 mnt = 2700dtk
		// 60 mnt = 3600dtk

		let str;
		if (time < 900) {
			str = "< 15 menit";
		} else if (time >= 900 && time < 1800) {
			str = "> 15 menit & < 30 menit";
		} else if (time >= 1800 && time < 2700) {
			str = "> 30 menit & < 45 menit";
		} else {
			str = "> 45 menit & < 60 menit";
		}

		await Record.updateOne(
			{ _id: data.record_id },
			{
				$set: {
					logout: logout,
					longtime: str,
				},
			}
		);

		return res.json({
			status: "SUCCESS",
		});
	} catch (error) {
		return res.json({
			status: "ERROR",
			data: error,
		});
	}
});

router.post("/create-user", async function (req, res) {
	const salt = bcrypt.genSaltSync(saltRounds);

	const data = {
		username: "superadmin",
		password: bcrypt.hashSync("password", salt),
	};

	return res.json({
		status: "SUCCESS",
		data: await User.create(data),
	});
});

router.post("/login", async function (req, res) {
	const { username, password } = req.body;

	try {
		// Cek User
		const v = await User.findOne({ username });

		if (v == null) {
			return res.json({
				status: "ERROR",
				data: "Check Username / Password",
			});
		}

		const match = await bcrypt.compare(password, v.password);

		if (!match) {
			return res.json({
				status: "ERROR",
				data: "Check Username / Password",
			});
		}

		const now = new Date().getTime();

		const record = await Record.create({
			user_id: v._id,
			login: now,
		});

		const accessToken = jwt.sign({ username: v.username, id: v._id, record_id: record._id }, ACCESS_TOKEN, {
			expiresIn: "1h",
		});

		return res.json({
			status: "SUCCESS",
			data: v,
			token: accessToken,
		});
	} catch (error) {
		return res.json({
			status: "ERROR",
			data: error,
		});
	}
});

router.post("/record", async function (req, res) {
	try {
		const rec1 = await Record.find({ longtime: "< 15 menit" });
		const rec2 = await Record.find({ longtime: "> 15 menit & < 30 menit" });
		const rec3 = await Record.find({ longtime: "> 30 menit & < 45 menit" });
		const rec4 = await Record.find({ longtime: "> 45 menit & < 60 menit" });

		const data = [
			{
				time: "< 15 menit",
				total: rec1.length,
			},
			{
				time: "> 15 menit & < 30 menit",
				total: rec2.length,
			},
			{
				time: "> 30 menit & < 45 menit",
				total: rec3.length,
			},
			{
				time: "> 45 menit & < 60 menit",
				total: rec4.length,
			},
		];

		return res.json({
			status: "SUCCESS",
			data: data,
		});
	} catch (error) {
		return res.json({
			status: "ERROR",
			data: error,
		});
	}
});

module.exports = router;
