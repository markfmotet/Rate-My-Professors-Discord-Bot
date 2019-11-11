#include <stdio.h>
#include <ctype.h>

int main() {

int count =0;

    printf("var professorCodes= [\n");
    char c = 0;
    FILE * input = fopen("H:\\CLion Projects\\codeGenerator\\HTML.txt", "r");

    while(c != EOF){

        if(c == '-'){

            c = getc(input);

            if(isdigit(c)){

                printf("[");

                while(c != '"'){
                    printf("%c", c);
                    c = getc(input);
                }
                printf(",");
                count++;

            }

        }

        if(c == 'e'){
            c = getc(input);
           // printf("IS E\n");
            if(c == '"'){
              //  printf("IS \"\n");
                c = getc(input);
                if(c == '>'){
                 //   printf("IS >\n");
                    c = getc(input);
                    if(isalpha(c)){
                        printf(" \"");
                        while(c != ','){
                            printf("%c", c);
                            c = getc(input);
                        }
                        printf("\", ");
                        c = getc(input);
                        c = getc(input);
                        printf("\"");
                        while(c != '\n'){
                            printf("%c", c);
                            c = getc(input);
                        }
                        printf("\"],\n");

                    }

                }

            }

        }


        c = getc(input);

    }
    printf("];");

    //printf("\nDONE %d", count);
    fclose(input);

    return 0;

}