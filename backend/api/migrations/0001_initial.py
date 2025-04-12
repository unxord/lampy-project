from django.db import migrations, models

class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='MainContentItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200, verbose_name='Заголовок')),
                ('content', models.TextField(verbose_name='Содержимое')),
                ('content_type', models.CharField(choices=[('INFO', 'Информация'), ('ANNOUNCE', 'Объявление'), ('NEWS', 'Новость')], db_index=True, default='INFO', max_length=10, verbose_name='Тип контента')),
                ('read_more_link', models.URLField(blank=True, null=True, verbose_name="Ссылка 'Читать далее'")),
                ('order', models.PositiveIntegerField(default=0, help_text='Чем меньше число, тем выше элемент в списке своего типа.', verbose_name='Порядок отображения')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Дата обновления')),
            ],
            options={
                'verbose_name': 'Элемент контента главной страницы',
                'verbose_name_plural': 'Элементы контента главной страницы',
                'ordering': ['content_type', 'order', '-created_at'],
            },
        ),
    ]
