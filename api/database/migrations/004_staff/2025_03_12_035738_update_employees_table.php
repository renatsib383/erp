<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->enum('gender',['муж','жен'])->nullable()->after('fio')->comment('Пол');
            $table->date('birthday')->nullable()->after('gender')->comment('Дата рождения');
            $table->string('short_name')->nullable()->after('birthday')->comment('Сокращённое наименование');
            $table->string('address')->nullable()->after('short_name')->comment('Адрес');
            $table->string('work_phone')->nullable()->after('phone')->comment('Рабочий телефон');
            $table->string('inn')->nullable()->after('address')->comment('ИНН');
            $table->string('snils')->nullable()->after('inn')->comment('СНИЛС');
            $table->string('photo')->nullable()->after('snils')->comment('Фото');
            $table->string('salary')->nullable()->after('photo')->comment('ЗП');
            $table->date('hired')->nullable()->after('salary')->comment('Дата приёма на работу');
            $table->date('fired')->nullable()->after('hired')->comment('Дата увольнения');
            $table->json('passport')->nullable()->after('fired')->comment('Паспорт');
            $table->json('documents')->nullable()->after('passport')->comment('Сканы документов');
            $table->foreignId('company_id')->nullable()->after('position_id')->comment('Компания');
            $table->integer('sort')->default(0)->after('company_id')->comment('Порядок сортировки');
        });
    }

    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn([
                'gender',
                'birthday',
                'short_name',
                'address',
                'work_phone',
                'inn',
                'snils',
                'photo',
                'salary',
                'hired',
                'fired',
                'passport',
                'documents',
                'company_id',
                'sort',
            ]);
        });
    }
};
