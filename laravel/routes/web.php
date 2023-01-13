<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {

    $response = Http::post('http://localhost:3004/api/record');

    $charts = [];
    foreach ($response['data'] as $item) {
        // name: "Fakultas Hukum",
        // y: 3945,

        $charts[] = [
            "name" => $item['time'],
            "y" => $item['total'],
        ];
    }
    // return $charts;

    $data = [
        "title" => "Lama Pengunjung Fitur Kalkulator",
        "data"  => $charts
    ];

    return view('grafik', $data);
});
