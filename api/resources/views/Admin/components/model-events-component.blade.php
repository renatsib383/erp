<div>
    @foreach ($events as $event)
        @if ($event->text != '')
        <div class="box">
            [{{$event->created_at->format('d.m.Y H:i')}}] {{ $event->user?->name }}<br>
            {!! $event->text !!}
        </div>
        <br>
        @endif
    @endforeach
</div>
