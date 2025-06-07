<?php

use App\Models\Staff\Employee;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('cash_registers', function (Blueprint $table) {
            $table->boolean('cash_flow')
                ->default(false)
                ->after('reportable')
                ->comment('Считать Приход-Расход за период');
            $table->foreignId('employee_id')
                ->nullable()
                ->after('id')
                ->comment('Владелец кассы');
        });
    }

    public function down(): void
    {
        Schema::table('cash_registers', function (Blueprint $table) {
            $table->dropColumn('cash_flow');
            $table->dropColumn('employee_id');
        });
    }
};
