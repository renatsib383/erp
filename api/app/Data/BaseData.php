<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class BaseData extends Data
{
    public function toModel(): array
    {
        $request_fields = array_keys(request()->all());
        return array_filter(
            $this->toArray(),
            fn($item,$key) => !is_null($item) || in_array($key,$request_fields),
            ARRAY_FILTER_USE_BOTH);
    }
}
