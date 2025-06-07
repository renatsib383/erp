<?php

namespace Database\Factories\Deals;

use App\Models\Deals\Deal;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Deal>
 */
class DealFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tags = [
            'ЖК Сказочный лес',
            'ЖК Лайково',
            'ЖК Матвеевский Парк',
            'ЖК Восточное бутово',
            'ЖК Лосиноостровский Парк',
            'ЖК Аквилон SKY',
            'Спецновострой',
            'База Мансур',
        ];

        return [
            'uid' => fake()->bothify('##??/#####'),
            'address' => fake()->address(),
            'budget_sum' => fake()->randomNumber(5, true),
            'confirmed_smet_sum' => fake()->randomNumber(5, true),
            'additional_works_sum' => fake()->randomNumber(5, true),
            'facility_type' => fake()->numberBetween(0, 7),
            'facility_condition' => fake()->numberBetween(0, 3),
            'renovation_type' => fake()->numberBetween(0, 3),
            'created_at' => fake()->dateTimeBetween('-1 years'),
            'tags' => [$tags[array_rand($tags)]],
        ];
    }
    public function configure(): Factory|DealFactory
    {
        return $this->afterCreating(function (Deal $deal) {
            $deal->stages()->attach(rand(1, 14));
        });
    }
}
