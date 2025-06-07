@if (isset($categories))

<div x-data="pricelist" class="table-responsive">

    <table class="table-list">
        <thead>

        </thead>
        <tbody>

            @foreach($categories as $category)

            <tr>
                <td colspan="3" class="text-center" style="font-size: 1.5rem">
                    {{$category->name}}
                </td>
            </tr>
            @foreach($category->groups as $group)
            <tr>
                <td colspan="3" class="text-center" style="font-size: 1rem">
                    {{$group->name}}
                    <a @click="openModal({{$group}})" class="btn btn-primary btn-sm">
                        +
                    </a>
                </td>
            </tr>
            @foreach($group->works as $work)
            <tr>
                <td>
                    {{$work->name}}
                </td>
                <td>
                    {{$eds[$work->ed]}}
                </td>
                <td>
                    <x-moonshine::form.input
                        type="number" step="1" min="1" @change="changeWorkPrice({{$work->id}}, $event.target.value)"
                        value="{{$work->price}}" />


                </td>

            </tr>
            @endforeach
            @endforeach

            @endforeach

        </tbody>

    </table>

    <x-moonshine::modal name="my-modal" title="Новая работа">
    <form>
        <x-moonshine::form.input class="mb-3" placeholder="name" x-model="workData.name" />
        <x-moonshine::form.input class="mb-3" placeholder="price" x-model="workData.price" />
        <a class="btn btn-primary btn-sm" @click="createWork()">Сохранить</a>
    </form>
</x-moonshine::modal>
</div>



<script>
    document.addEventListener("alpine:init", () => {
        Alpine.data("pricelist", () => ({

            workData: {
                name: '',
                price: null
            },
            createWork() {
                MoonShine.ui.toggleModal('my-modal')
                MoonShine.ui.toast(this.workData.name, 'success')
            },

            init() {
                // alert(1);
            },
            openModal(str) {
                console.log(str)
                MoonShine.ui.toggleModal('my-modal')
            },
            changeWorkPrice(work_id, price) {
                this.workData.id = work_id;
                this.workData.price = price;
                if (confirm('Изменить цену на ' + price + '?')) {
                    MoonShine.ui.toast('Hello world', 'success')
                }
            }
        }))
    })
</script>
@else
<x-moonshine::layout.box>
    Прайс-лист станет доступен после создания компании
    </x-moonshine::box>
    @endif