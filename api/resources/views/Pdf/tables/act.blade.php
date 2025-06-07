<table class="main">
    <thead>
    <tr>
        <th>№ п.п.</th>
        <th>Наименование</th>
        <th>Значение</th>
        <th>Цена за ед.</th>
        <th width="135px">Итого</th>
    </tr>
    </thead>
    <tbody>
    @php
        $category = 0;
        $group = 0;
        $index = 1;
        $total = 0;
        $categoryTotal =0;
    @endphp

    @foreach ($room['works'] as $work => $value)
        @if($price[$work]['category']['id'] != $category)
            @if($category>0)
            <tr class="total-section">
                <td align="right" colspan="4">Итого «{{ $categoryName  }}»</td>
                <td align="right">{{ Number::format($categoryTotal, precision: 2, locale: 'ru') }} р.</td>
            </tr>
            @endif
            <tr class="object-work">
                <td colspan="5" style="text-align: center;">{{ $price[$work]['category']['name']  }}</td>
            </tr>
            @php
                $category = $price[$work]['category']['id'];
                $categoryName = $price[$work]['category']['name'];
                $categoryTotal = 0;
            @endphp
        @endif
        @if($price[$work]['group']['id'] != $group)
            <tr class="type-section-name">
                <td colspan="5" style="text-align: center;">{{ $price[$work]['group']['name']  }}</td>
            </tr>
            @php
                $group = $price[$work]['group']['id'];
            @endphp
        @endif
        @php
        $workTotal = $price[$work]['price']*$value;
        $total += $workTotal;
        $categoryTotal += $workTotal;
        @endphp
        <tr>
            <td style="text-align: center;">{{ $index++ }}</td>
            <td>{{ $price[$work]['name'] }}</td>
            <td style="text-align: right;">{{ $value }} {{ $price[$work]['ed'] }}</td>
            <td style="text-align: right;">{{ Number::format($price[$work]['price'], precision: 2, locale: 'ru') }} р.</td>
            <td style="text-align: right;">{{ Number::format($workTotal, precision: 2, locale: 'ru') }} р.</td>
        </tr>
    @endforeach
        <tr class="total-section">
            <td align="right" colspan="4">Итого «{{ $categoryName  }}»</td>
            <td align="right">{{ Number::format($categoryTotal, precision: 2, locale: 'ru') }} р.</td>
        </tr>
    </tbody>
</table>
