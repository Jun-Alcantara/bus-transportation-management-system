<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DistrictController;
use App\Http\Controllers\SchoolController;
use App\Http\Controllers\Settings\SchoolYearController;
use App\Http\Controllers\Settings\SchoolTermController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\UploadBatchController;
use App\Http\Controllers\StudentDataUploadController;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

// Authentication Routes
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Protected Routes
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // District Routes
    Route::resource('districts', DistrictController::class)->except(['create', 'show', 'edit']);
    
    // Client Routes
    Route::resource('clients', ClientController::class)->except(['show', 'destroy']);
    Route::patch('clients/{client}/disable', [ClientController::class, 'disable'])->name('clients.disable');
    Route::patch('clients/{client}/enable', [ClientController::class, 'enable'])->name('clients.enable');
    
    // School Routes
    Route::resource('schools', SchoolController::class)->except(['show', 'destroy']);
    Route::patch('schools/{school}/disable', [SchoolController::class, 'disable'])->name('schools.disable');
    Route::patch('schools/{school}/enable', [SchoolController::class, 'enable'])->name('schools.enable');
    
    // Student Routes
    Route::resource('students', StudentController::class)->except(['show', 'destroy']);
    Route::patch('students/{student}/disable', [StudentController::class, 'disable'])->name('students.disable');
    Route::patch('students/{student}/enable', [StudentController::class, 'enable'])->name('students.enable');
    
    // Student Data Upload Routes
    Route::resource('upload-batches', UploadBatchController::class)->except(['create', 'edit']);
    Route::post('upload-batches/{uploadBatch}/upload', [StudentDataUploadController::class, 'upload'])->name('upload-batches.upload');
    
    // Settings Routes
    Route::prefix('settings')->name('settings.')->group(function () {
        Route::get('/year-and-terms', [SchoolYearController::class, 'index'])->name('year-and-terms');
        
        // School Year Routes
        Route::post('/school-years', [SchoolYearController::class, 'store'])->name('school-years.store');
        Route::patch('/school-years/{schoolYear}', [SchoolYearController::class, 'update'])->name('school-years.update');
        Route::patch('/school-years/{schoolYear}/set-active', [SchoolYearController::class, 'setActive'])->name('school-years.set-active');
        Route::delete('/school-years/{schoolYear}', [SchoolYearController::class, 'destroy'])->name('school-years.destroy');
        
        // School Term Routes
        Route::post('/school-terms', [SchoolTermController::class, 'store'])->name('school-terms.store');
        Route::patch('/school-terms/{schoolTerm}', [SchoolTermController::class, 'update'])->name('school-terms.update');
        Route::patch('/school-terms/{schoolTerm}/set-active', [SchoolTermController::class, 'setActive'])->name('school-terms.set-active');
        Route::delete('/school-terms/{schoolTerm}', [SchoolTermController::class, 'destroy'])->name('school-terms.destroy');
    });
});
