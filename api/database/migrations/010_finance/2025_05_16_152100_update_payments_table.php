<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->integer('prorab')->nullable()->after('user_id')->comment('Прораб');
            $table->integer('nu')->nullable()->after('prorab')->comment('НУ');
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn('prorab');
            $table->dropColumn('nu');
        });
    }
};
