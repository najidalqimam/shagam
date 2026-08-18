<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_offerings', function (Blueprint $table) {
            $table->id();
            $table->string('locale', 8)->index();
            $table->unsignedInteger('sort_order')->default(0);
            $table->string('title');
            $table->text('body')->nullable();
            $table->string('meta')->nullable();
            $table->string('kind')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_offerings');
    }
};
