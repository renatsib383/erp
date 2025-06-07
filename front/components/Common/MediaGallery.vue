<template>
  
</template>

<script>
  import Lightgallery from 'lightgallery';
  import lgThumbnail from 'lightgallery/plugins/thumbnail';
  import lgZoom from 'lightgallery/plugins/zoom';
  import lgVideo from 'lightgallery/plugins/video';
  import 'lightgallery/css/lightgallery.css';
  import 'lightgallery/css/lg-thumbnail.css';
  import 'lightgallery/css/lg-zoom.css';
  import 'lightgallery/css/lg-video.css';
  import { nextTick } from 'vue';

    export default {
        props: {
            groupMessages: { type: Array, default: () => [] },
            type: { type: String, default: 'chat' },
            apiBase: {type: String, default: ''},
        },        
        data() {            
            return {
                plugins: [lgZoom, lgThumbnail, lgVideo],
                dynamicGallery: null
            };
        },      
        methods: {
            getGalleryDynamicElements() {
                let messages = [];
                for (let key of Object.keys(this.groupMessages)) {
                    let keyMessages = this.groupMessages[key].filter(message => 
                        message.file && 
                        message.file.url &&
                        (message.file.mime.includes('image'))
                    );
                    messages = [...keyMessages,...messages];
                }
                let result = messages.map(msg => {
                        return {
                            msg_id: msg.id,
                            src: `${this.apiBase}/${this.type}/${msg.file.url}`, 
                            thumb: `${this.apiBase}/${this.type}/${msg.file.url}`
                        }
                });
                console.log('[MediaGallery] result: ',result);
                return messages.map(msg => {
                    // if (msg.file.mime.includes('video')) {
                    //     return {
                    //         msg_id: msg.id,
                    //         video: {
                    //         source: [
                    //             {
                    //             src: `/${this.type}/${msg.file.url}`,
                    //             type: msg.file.mime,
                    //             },
                    //         ],
                    //         attributes: { preload: false, controls: true },
                    //         },
                    //         thumb: "/images/video.svg",
                    //     }
                    // } else {
                        return {
                            msg_id: msg.id,
                            src: `${this.apiBase}/${this.type}/${msg.file.url}`, 
                            thumb: `${this.apiBase}/${this.type}/${msg.file.thumb}`
                        }
                    // }
                });
            },
            async launch(event, currentId) {
                await nextTick();
                event.preventDefault();
                let dynamicEls = this.getGalleryDynamicElements();
                let currentIndex = dynamicEls.findIndex(el => el.msg_id == currentId);
                if (dynamicEls.length == 0) {
                    return;
                }
                this.dynamicGallery = Lightgallery(document.documentElement, {
                    dynamic: true,
                    dynamicEl: dynamicEls,
                    // addClass: 'iw-lightbox',
                    // escKey: true,
                    // share: false,
                    // index: 0,
                    plugins: [lgZoom, lgThumbnail, lgVideo],
                    // onBeforeClose: () => {
                    //   console.log('onBeforeClose');
                    // },
                    // onCloseAfter: () => {
                    //   console.log('onCloseAfter');
                    // },
                });

                this.dynamicGallery.openGallery(currentIndex);
            }, 
            refresh() {
                // if (this.dynamicGallery) {
                //     this.dynamicGallery.refresh();
                // }
            }  
        },
        mounted() {
            // console.log('[MediaGallery] type',this.type);
        }
        // onGalleryInit: (detail) => {
        //     lightgalleryIns = detail.instance;
        //     console.log('lightgalleryIns has been initialized');
        //     console.log('lightgalleryIns',lightgalleryIns);
        // },

    }
</script>

<style>
    .lg-backdrop {
        z-index: 1240;
    }
    .lg-outer {
        z-index: 1250;
    }    
</style>