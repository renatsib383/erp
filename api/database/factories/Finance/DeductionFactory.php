<?php

namespace Database\Factories\Finance;

use App\Models\Finance\Deduction;
use App\Models\Staff\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Deduction>
 */
class DeductionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $employees = Employee::whereIn('position_id',[2,3,4])
            ->where('short_name','<>','')
            ->whereNotNull('chief')
            ->take(10)
            ->get(['id']);
        $employeesCount = $employees->count();

        return [
            'employee_id' => $employees->get(fake()->numberBetween(0, $employeesCount-1))->id,
            'date' => fake()->dateTimeBetween('-1 month', 'now'),
            'official_salary' => fake()->numberBetween(1000, 100000),
            'tax' => fake()->numberBetween(1000, 10000),
            'bounty' => fake()->numberBetween(1000, 10000),
            'fines' => fake()->numberBetween(1000, 10000),
        ];
    }
}
