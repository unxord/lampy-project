import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='CommonContentItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('page', models.CharField(choices=[('home', 'Главная (Home)'), ('about', 'О нас (About)'), ('help', 'Помощь (Help)')], db_index=True, default='home', help_text='Страница, на которой будет отображаться этот контент.', max_length=20, verbose_name='Страница')),
                ('title', models.CharField(max_length=255, verbose_name='Заголовок')),
                ('content', models.TextField(verbose_name='Содержимое')),
                ('read_more_link', models.URLField(blank=True, null=True, verbose_name="Ссылка 'Читать далее'")),
                ('author_pseudonym', models.CharField(blank=True, help_text='Если указано, будет отображаться вместо имени пользователя.', max_length=150, null=True, verbose_name='Псевдоним автора (переопределение)')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, verbose_name='Дата создания')),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now, verbose_name='Дата обновления')),
                ('author', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='common_content_items', to=settings.AUTH_USER_MODEL, verbose_name='Автор (Пользователь)')),
            ],
            options={
                'verbose_name': 'Элемент общего контента',
                'verbose_name_plural': 'Элементы общего контента',
                'ordering': ['-created_at'],
            },
        ),
    ]
