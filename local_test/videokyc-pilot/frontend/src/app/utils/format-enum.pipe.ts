import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "formatEnum"
})
export class FormatEnumPipe implements PipeTransform {
    transform(enumString: string): string {
        try {
            enumString = enumString.replace(/([a-z])([A-Z])/g, '$1 $2');
            enumString = enumString.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            return enumString
        }
        catch (ex) {
            return enumString;
        }
    }
}   