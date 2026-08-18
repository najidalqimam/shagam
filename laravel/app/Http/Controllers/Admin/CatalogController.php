<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DroneManufacturer;
use Illuminate\View\View;

class CatalogController extends Controller
{
    public function index(): View
    {
        return view('admin.catalog', [
            'manufacturers' => DroneManufacturer::query()
                ->withCount('aircraft')
                ->orderBy('name')
                ->paginate(30),
        ]);
    }
}
