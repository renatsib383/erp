<!DOCTYPE html>
<html lang="en">
<head>
    <title>ПРАЙС-ЛИСТ НА РАБОТЫ {{ $deal['uid'] }} от {{ $deal['date'] }}г.</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    @include('Pdf.styles')

</head>
<body>
@include('Pdf.header')
@include('Pdf.footer')
@include('Pdf.first_page',['doc_name' => 'ПРАЙС-ЛИСТ НА РАБОТЫ', 'num'=>2])

<tocpagebreak links="on" />
<table class="main">
    <thead>
    <tr>
        <th width="8%">№ п.п.</th>
        <th>Наименование</th>
        <th width="10%">Ед.</th>
        <th width="15%">Цена</th>
    </tr>
    </thead>
    <tbody>
    @php
        $category = 0;
        $group = 0;
        $index = 1;
    @endphp
    @foreach ($price as $work)
        @if($work['category']['id'] != $category)

            <tr class="object-work">
                <td colspan="4" style="text-align: center;">{{ $work['category']['name']  }}<tocentry content="{{ $work['category']['name']  }}" /></td>
            </tr>
            @php
                $category = $work['category']['id'];
                $index = 1;
            @endphp
        @endif
        @if($work['group']['id'] != $group)
            <tr class="type-section-name">
                <td colspan="4" style="text-align: center;">{{ $work['group']['name']  }}</td>
            </tr>
            @php
                $group = $work['group']['id'];
            @endphp
        @endif

        <tr>
            <td style="text-align: center;">{{ $index++ }}</td>
            <td>{{ $work['name'] }}</td>
            <td style="text-align: center;">{{ $work['ed'] }}</td>
            <td style="text-align: center;">{{ Number::format($work['price'], precision: 2, locale: 'ru') }} р.</td>
        </tr>
    @endforeach
    </tbody>
</table>
</body>
</html>
