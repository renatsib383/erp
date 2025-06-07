<?php

namespace App\Traits;

use App\Models\Deals\Pipeline;
use App\Models\Deals\Stage;

trait Fields
{
    protected function getFields($key)
    {
        $fields = config($key);

        foreach ($fields as &$field) {
            if ($field['type'] === 'index') {
                switch ($field['source']) {
                    case 'config':
                        if (isset($field['pluck'])) {
                            $pluck = explode('|', $field['pluck']);
                            $field['list'] = collect(config($field['target']))->pluck($pluck[1], $pluck[0]);
                        } else {
                            $field['list'] = config($field['target']);
                        }

                        break;
                    case 'model':
                        $field['list'] = match ($field['target']) {
                            'Pipeline' => Pipeline::all(['id', 'name'])->pluck('name', 'id'),
                            'Stage' => Stage::all(['id', 'title'])->pluck('title', 'id'),
                            default => [],
                        };
                }
            }
        }

        return $fields;
    }

    protected function flatList($fields)
    {
        foreach ($fields as &$field) {
            if (isset($field['list'])) {
                $list = collect($field['list']);
                if ($list->firstWhere('title') !== null) {
                    $list = $list->pluck('title');
                    $field['list'] = $list->toArray();
                }
            }
        }

        return $fields;
    }
}
