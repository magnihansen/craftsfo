/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}
// You should specify the CKEditor 5 build you use here:
declare module '@ckeditor/ckeditor5-build-classic' {
    const ClassicEditorBuild: any;

    export = ClassicEditorBuild;
}
