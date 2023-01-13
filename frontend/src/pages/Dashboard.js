import React, { useEffect, useState } from "react";
import { parseCookies, destroyCookie } from "nookies";
import { useHistory } from "react-router-dom";
import angkaTerbilang from "@develoka/angka-terbilang-js";
import http from "../utils/http";
import isEmpty from "../utils/isEmpty";

export default function Dashboard() {
	let history = useHistory();
	const [angkaSatu, setAngkaSatu] = useState(0);
	const [angkaDua, setAngkaDua] = useState(0);
	const [hasil, setHasil] = useState(0);
	const [bill, setBill] = useState("");
	const [user, setUser] = useState({});

	useEffect(() => {
		const cookies = parseCookies();
		const { token } = cookies;

		if (token == null) {
			history.replace("/login");
		} else {
			http.get("/user", { headers: { auth: token } }).then(item => {
				setUser(item.data.data);
				// console.log(item.data);
			});
		}
	}, []);

	const calc = bil => () => {
		const bil1 = parseInt(angkaSatu);
		const bil2 = parseInt(angkaDua);

		if (bil == "tambah") {
			const h = bil1 + bil2;
			setHasil(h);
			setBill(angkaTerbilang(h));
		} else if (bil == "kurang") {
			const h = bil1 - bil2;
			setHasil(h);
			setBill(angkaTerbilang(h));
		} else if (bil == "kali") {
			const h = bil1 * bil2;
			setHasil(h);
			setBill(angkaTerbilang(h));
		} else if (bil == "bagi") {
			const h = bil1 / bil2;
			setHasil(h);
			setBill(angkaTerbilang(h));
		}
	};

	const logout = async () => {
		const cookies = parseCookies();
		const { token } = cookies;
		// console.log(token);
		const resLogout = await http.get("/logout", { headers: { auth: token } });
		// console.log(resLogout);
		if (resLogout.data.status == "SUCCESS") {
			destroyCookie(null, "token");
			history.replace("/login");
		}
	};

	return (
		<div className="bg-yellow-400 h-screen w-full">
			<div className="container pt-10">
				<div className="grid grid-cols-2 gap-4">
					<div>
						<div className="grid grid-cols-2 gap-4 mb-10">
							<div>
								<input
									type="number"
									name="fName"
									id="fName"
									placeholder="Masukan Angka Pertama"
									className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
									onChange={e => setAngkaSatu(e.target.value)}
								/>
							</div>
							<div>
								<input
									type="number"
									name="fName"
									id="fName"
									placeholder="Masukan Angka Kedua"
									className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
									onChange={e => setAngkaDua(e.target.value)}
								/>
							</div>
						</div>
						<button
							className="block uppercase w-full shadow bg-indigo-800 hover:bg-indigo-700 focus:shadow-outline focus:outline-none text-white text-xs py-3 px-10 rounded mb-5"
							onClick={calc("tambah")}
						>
							Pertambahan
						</button>
						<button
							className="block uppercase w-full shadow bg-indigo-800 hover:bg-indigo-700 focus:shadow-outline focus:outline-none text-white text-xs py-3 px-10 rounded mb-5"
							onClick={calc("kurang")}
						>
							Pengurangan
						</button>
						<button
							className="block uppercase w-full shadow bg-indigo-800 hover:bg-indigo-700 focus:shadow-outline focus:outline-none text-white text-xs py-3 px-10 rounded mb-5"
							onClick={calc("kali")}
						>
							Perkalian
						</button>
						<button
							className="block uppercase w-full shadow bg-indigo-800 hover:bg-indigo-700 focus:shadow-outline focus:outline-none text-white text-xs py-3 px-10 rounded mb-5"
							onClick={calc("bagi")}
						>
							Pembagian
						</button>
						<h2 className="text-5xl mb-3">Hasil : {hasil}</h2>
						<h2 className="text-2xl">{bill}</h2>
					</div>
					<div>
						<h2 className="text-5xl mb-3">Info User</h2>
						{!isEmpty(user) && (
							<>
								<h2 className="text-2xl mb-3">Username : {user.username}</h2>
								<button
									className="block uppercase shadow bg-red-800 hover:bg-red-700 focus:shadow-outline focus:outline-none text-white text-xs py-3 px-10 rounded mb-5"
									onClick={logout}
								>
									Logout
								</button>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
